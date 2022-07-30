<template>
  <div class="flex flex-wrap w-full justify-center bg-sky-500 py-20">
    <div v-if="!ready" class="text-white">
      載入中...
    </div>
    <div v-else-if="!access" class="text-white">
      {{ status || "存取遭拒" }}
    </div>
    <div v-else>
      <div class="max-w-md mx-3 my-5 py-4 px-8 bg-white shadow-lg rounded-lg">
        <h2 class="text-gray-800 text-3xl font-semibold">加入管理層社群</h2>
        <p class="mt-2 text-gray-600">你好，{{ profile.nickname }}，這裡是加入密碼：</p>
        <p v-show="status" class="mt-2 text-red-600">{{ status }}</p>
        <div class="w-full mt-2 text-gray-600 flex rounded bg-white shadow-md">
          <input :value="password"
                 class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
                 type="text">
          <button class="m-2 rounded px-4 py-2 font-semibold" @click="copySecret">
            <svg v-show="ready" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  stroke-linecap="round"
                  stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="flex justify-end mt-4">
          <a
              :href="url"
              class="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            加入連結在這裡
          </a>
        </div>
      </div>
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
      const refer = `${process.env.VUE_APP_SELF_HOST}/#/admin/room`;
      const url = `${process.env.VUE_APP_SARA_INTE_HOST}/?refer=${encodeURIComponent(refer)}`;
      location.assign(url);
      return;
    }
    if (
        Array.isArray(this.profile?.roles) &&
        this.profile.roles.includes('openchat')
    ) {
      this.access = true;
    } else {
      console.log("forbidden")
      return;
    }
    try {
      const xhr = await this.$axios.get('/admin-room');
      this.url = xhr.data.url;
      this.password = xhr.data.password;
    } catch (error) {
      if (!error?.response?.data?.code) {
        this.status = '授權伺服器發生嚴重錯誤';
      }
    } finally {
      this.ready = true;
    }
  }
}
</script>
