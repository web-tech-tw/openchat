<template>
  <div class="flex flex-wrap w-full justify-center bg-sky-500 py-20">
    <div class="max-w-md mx-3 my-5 py-4 px-8 bg-white shadow-lg rounded-lg">
      <h2 class="text-gray-800 text-3xl font-semibold">檢查加入代碼</h2>
      <p class="mt-2 text-gray-600">請輸入申請人的加入代碼：</p>
      <div class="w-full mt-2 text-gray-600 flex rounded bg-white w-auto shadow-md">
        <input class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
               type="text" v-model="query" placeholder="例如：000000" @keydown.enter="submit">
        <button class="m-2 rounded px-4 px-4 py-2 font-semibold" @click="submit">
          <svg class="mt-1 h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round"
                  stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="max-w-md mx-3 my-5 py-4 px-8 bg-white shadow-lg rounded-lg" v-show="application.code">
      <h2 class="text-gray-800 text-3xl font-semibold">
        加入代碼：{{ application.code }}
      </h2>
      <p class="mt-2 text-gray-600">
        使用者代碼：{{ application.user_agent }}<br/>
        IP 位址：{{ application.ip_address }}<br/>
        申請時間：{{ new Date(application.created_at * 1000) }}
      </p>
      <div class="flex justify-end mt-4">
        <button
            class="flex items-center justify-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-1 rounded-full"
            @click="approval">
          許可
        </button>
        <button
            class="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mx-1 rounded-full"
            @click="reject">
          否決
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminJoinView",
  data: () => ({
    query: null,
    application: {}
  }),
  computed: {
    authOptions() {
      return {headers: {Authorization: localStorage.getItem(process.env.VUE_APP_SARA_TOKEN_NAME)}}
    }
  },
  methods: {
    submit() {
      const options = {
        ...this.authOptions,
        params: {code: this.query}
      };
      this.$axios
          .get("application", options)
          .then((xhr) => this.application = xhr.data)
          .catch((error) => console.error((error)));
    },
    approval() {
      const formData = new URLSearchParams();
      formData.set("code", this.application.code);
      const options = {
        ...this.authOptions,
        data: formData
      };
      this.$axios
          .patch("application", options)
          .then(() => this.application = {})
          .catch((error) => console.error((error)));
    },
    reject() {
      const formData = new URLSearchParams();
      formData.set("code", this.application.code);
      const options = {
        ...this.authOptions,
        data: formData
      };
      this.$axios
          .delete("application", options)
          .then(() => this.application = {})
          .catch((error) => console.error((error)));
    }
  }
}
</script>
