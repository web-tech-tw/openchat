<template>
  <div class="flex w-full justify-center bg-sky-500">
    <div class="max-w-md py-4 px-8 bg-white shadow-lg rounded-lg my-20">
      <div class="flex justify-center md:justify-end -mt-16">
        <img :alt="info.name" class="w-20 h-20 object-cover rounded-full border-2 border-white-500" :src="icon">
      </div>
      <div>
        <h2 class="text-gray-800 text-3xl font-semibold">{{ info.name }}</h2>
        <p class="mt-2 text-gray-600" v-show="!accept">{{ info.description }}</p>
        <p class="mt-2 text-amber-500" v-show="!accept">
          加入社群，即代表您同意遵守我們的
          <router-link to="/rule" class="text-red-500">社群守則</router-link>
          。
        </p>
        <p class="mt-2 text-red-600" v-show="notice">{{ notice }}</p>
        <p class="mt-2 text-gray-600" v-show="accept">
          請複製這份代碼，再複製到OpenChat的審核答案內：
        </p>
        <div class="w-full mt-2 text-gray-600 flex rounded bg-white w-auto shadow-md" v-show="accept">
          <input class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
                 type="text" :value="secret" :disabled="loading">
          <button class="m-2 rounded px-4 px-4 py-2 font-semibold" @click="copySecret" :disabled="loading">
            <svg v-show="loading" class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                 fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-show="!loading" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button
            class="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            @click="submit"
            :disabled="loading"
        >
          <svg v-show="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ state }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import data from "@/assets/hub.json";

export default {
  name: "JoinChatView",
  props: {
    code: {
      type: String,
      required: true
    }
  },
  data: () => ({
    info: {
      name: null,
      description: null,
      url: null
    },
    secret: null,
    notice: null,
    accept: false,
    loading: false
  }),
  computed: {
    icon() {
      if (!this.code) return null;
      return `${process.env.BASE_URL}static/images/chats/${this.code}.jpg`;
    },
    state() {
      return !this.accept ?
          "加入社群"
          : this.loading
              ? "載入中..."
              : "送出，並將前往OpenChat界面於輸入代碼"
    }
  },
  methods: {
    copySecret() {
      if (!navigator.clipboard) {
        this.notice = '您的瀏覽器不支援複製功能'
        return
      }
      navigator.clipboard
          .writeText(this.secret)
          .then(() => this.notice = '已複製代碼')
          .catch(() => this.notice = '無法複製代碼')
    },
    submit() {
      if (!this.accept) {
        this.accept = true;
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.secret = "openchat";
        }, 3000);
      } else {
        location.href = this.info.url;
      }
    }
  },
  created() {
    if (this.code in data) {
      this.info = data[this.code];
    } else {
      this.$router.replace({name: "join"});
    }
  }
}
</script>
