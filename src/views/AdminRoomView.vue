<template>
  <div class="flex flex-wrap w-full justify-center bg-sky-500 py-20">
    <div v-if="access">
      <div class="max-w-md mx-3 my-5 py-4 px-8 bg-white shadow-lg rounded-lg">
        <h2 class="text-gray-800 text-3xl font-semibold">加入管理層社群</h2>
        <p class="mt-2 text-gray-600">你好，{{ profile.nickname }}，這裡是加入密碼：</p>
        <p class="mt-2 text-red-600" v-show="status">{{ status }}</p>
        <div class="w-full mt-2 text-gray-600 flex rounded bg-white w-auto shadow-md">
          <input class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
                 type="text" :value="password" :disabled="!ready">
          <button class="m-2 rounded px-4 px-4 py-2 font-semibold" @click="copySecret" :disabled="!ready">
            <svg v-show="!ready" class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                 fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-show="ready" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
            </svg>
          </button>
        </div>
        <div class="flex justify-end mt-4">
          <button
              class="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              :disabled="!ready"
          >
            <svg v-show="!ready" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                 fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            立即加入
          </button>
        </div>
      </div>
    </div>
    <div class="text-white" v-else>
      {{ ready ? "存取遭拒" : "載入中..." }}
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminRoomView",
  data: () => ({
    profile: null,
    status: null,
    ready: false,
    access: false,
    url: null,
    password: null
  }),
  methods: {
    copySecret() {
      if (!navigator.clipboard) {
        this.status = '您的瀏覽器不支援複製功能'
        return
      }
      navigator.clipboard
          .writeText(this.password)
          .then(() => this.status = '已複製代碼')
          .catch(() => this.status = '無法複製代碼')
    },
  },
  async created() {
    this.profile = await this.$profile();
    if (!this.profile) {
      const refer = `${process.env.VUE_APP_OPENCHAT_JOIN_HOST}/#/admin/room`;
      const url = `${process.env.VUE_APP_SARA_INTE_HOST}/?refer=${refer}`;
      location.assign(url);
      return;
    }
    try {
      const xhr = await this.$axios.get('/admin-room');
      this.ready = true;
      this.access = true;
      this.url = xhr.data.url;
      this.password = xhr.data.password;
    } catch (error) {
      this.ready = true;
      if (!error?.response?.data?.code) {
        this.status = '授權伺服器發生嚴重錯誤';
      }
    }
  }
}
</script>
