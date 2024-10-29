<template>
  <div class="flex w-full justify-center bg-sky-500">
    <div class="max-w-md py-4 px-8 bg-white shadow-lg rounded-lg my-20">
      <div class="flex justify-center md:justify-end -mt-16">
        <img :alt="info.name" :src="icon" class="w-20 h-20 object-cover rounded-full border-2 border-white-500">
      </div>
      <div>
        <h2 class="text-gray-800 text-3xl font-semibold">{{ info.name }}</h2>
        <p v-show="!accept" class="mt-6 text-gray-600" v-html="description"></p>
        <p v-show="!accept" class="mt-6 text-amber-600">
          加入社群，即代表您同意遵守我們的
          <router-link class="text-red-500" to="/rule">社群守則</router-link>
          。
        </p>
        <p v-show="status" class="mt-2 text-red-600">{{ status }}</p>
        <p v-show="accept" class="mt-2 text-gray-600">
          請複製這份代碼，再貼上到OpenChat的審核答案內：
        </p>
        <div v-show="accept" class="w-full mt-2 text-gray-600 flex rounded bg-white shadow-md">
          <input :disabled="!ready"
                 :value="secret"
                 class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
                 type="text">
          <button :disabled="!ready" class="m-2 rounded px-4 py-2 font-semibold" @click="copySecret">
            <svg v-show="!ready" class="animate-spin -ml-1 mr-3 h-5 w-5" fill="none"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"></path>
            </svg>
            <svg v-show="ready" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  stroke-linecap="round"
                  stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div v-show="!accept" class="checkbox my-3">
        <div id="captcha" data-theme="light"></div>
      </div>
      <div class="flex justify-end mt-4">
        <button
            :disabled="!ready"
            class="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            @click="submit"
        >
          <svg v-show="!ready" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none"
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"></path>
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
    captcha: null,
    secret: null,
    status: null,
    accept: false,
    ready: true,
    turnstileScript: null,
  }),
  computed: {
    icon() {
      if (!this.code) return null;
      return `${process.env.BASE_URL}static/images/chats/${this.code}.jpg`;
    },
    description() {
      return this.info.description.replaceAll("\n", "<br />")
    },
    state() {
      return !this.accept ?
          "加入社群"
          : this.ready
              ? "前往OpenChat界面貼上代碼"
              : "載入中..."
    }
  },
  methods: {
    copySecret() {
      if (!navigator.clipboard) {
        this.status = '您的瀏覽器不支援複製功能'
        return
      }
      navigator.clipboard
          .writeText(this.secret)
          .then(() => this.status = '已複製代碼')
          .catch(() => this.status = '無法複製代碼')
    },
    async submit() {
      if (!this.accept) {
        if (!this.captcha) {
          this.status = '尚未完成系統驗證';
          return;
        }

        this.accept = true;
        this.ready = false;
        this.status = "";
        const form = new URLSearchParams();
        form.set('slug', this.code);
        form.set('captcha', this.captcha);
        try {
          const xhr = await this.$axios.post("applications", form)
          this.ready = true;
          this.secret = xhr.data.code;
        } catch (e) {
          if (e?.response?.data?.code) {
            this.secret = e?.response?.data?.code;
          } else {
            this.status = '授權伺服器發生嚴重錯誤';
          }
        } finally {
          this.ready = true;
        }
      } else {
        location.href = this.info.url;
      }
    }
  },
  mounted() {
    document.head.appendChild(this.turnstileScript);
  },
  beforeDestroy() {
    document.head.removeChild(this.turnstileScript);
  },
  created() {
    const turnstileScriptUrl = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=loadTurnstile";
    this.turnstileScript = document.createElement("script");
    this.turnstileScript.setAttribute("src", turnstileScriptUrl);
    window.loadTurnstile = () => {
      window.turnstile.render("#captcha", {
        sitekey: process.env.VUE_APP_TURNSTILE_SITE_KEY,
        callback: (token) => {
          this.captcha = token;
        },
      });
    };
    if (this.code in data) {
      this.info = data[this.code];
    } else {
      this.$router.replace({name: "join"});
    }
  }
}
</script>
