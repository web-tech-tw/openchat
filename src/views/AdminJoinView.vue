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
        <h2 class="text-gray-800 text-3xl font-semibold">檢查加入代碼</h2>
        <p class="mt-2 text-gray-600">請輸入申請人的加入代碼：</p>
        <div class="w-full mt-2 text-gray-600 flex rounded bg-white shadow-md">
          <input v-model="query"
                 class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
                 placeholder="例如：000000" type="text" @keydown.enter="submit">
          <button class="m-2 rounded px-4 py-2 font-semibold" @click="submit">
            <svg class="mt-1 h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <p v-show="status" class="mt-2 text-red-600">{{ status }}</p>
      </div>
      <div v-if="application.code" class="max-w-md mx-3 my-5 py-4 px-8 bg-white shadow-lg rounded-lg">
        <h2 class="text-gray-800 text-3xl font-semibold mb-3">
          加入代碼：{{ application.code }}
        </h2>
        <p class="mt-2 text-gray-600">
          <ul class="mb-3">
            <li>申請時間：{{ dateParsedCreatedAt }}</li>
          </ul>
          <ul class="mb-3">
            <li>IP 位址：{{ application.ipAddress }}</li>
            <li>IP 地理資訊：
              <ul class="pl-3">
                <li>國家：{{ application.ipGeolocation.country }}</li>
                <li>城市：{{ application.ipGeolocation.city }}</li>
                <li>時區：{{ application.ipGeolocation.timezone }}</li>
              </ul>
            </li>
          </ul>
          <ul class="mb-3">
            <li>使用者裝置資訊：
              <ul class="pl-3">
                <li>作業系統：
                  <ul class="pl-3">
                    <li>名稱：{{ uaParsed.os.name }}</li>
                    <li>版本：{{ uaParsed.os.version }}</li>
                  </ul>
                </li>
                <li>瀏覽器：
                  <ul class="pl-3">
                    <li>名稱：{{ uaParsed.browser.name }}</li>
                    <li>版本：{{ uaParsed.browser.version }}</li>
                    <li>使用者代理：
                      <p class="pl-3">
                        <code>{{ uaParsed.ua }}</code>
                      </p>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </p>
        <div v-if="!application.commitBy" class="flex justify-end mt-4">
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
        <p v-else class="mt-2 text-amber-600">
          已由 {{ application.commitBy }} 於 {{ dateParsedApprovalAt }} 簽署 {{ application.commitState ? '許可' : '否決' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import uaParser from "ua-parser-js";

import dayjs from "dayjs";
import dayjsUtc from "dayjs/plugin/utc";
import dayjsTimezone from "dayjs/plugin/timezone";
import dayjsLocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);
dayjs.extend(dayjsLocalizedFormat);

export default {
  name: "AdminJoinView",
  data: () => ({
    access: false,
    ready: false,
    query: null,
    status: null,
    application: {}
  }),
  methods: {
    dateToHuman(timestamp) {
      const userTimezone = dayjs.tz.guess();
      return dayjs.tz(timestamp, userTimezone).format("llll");
    },
    async submit() {
      this.status = '';
      if (!this.query) {
        this.status = '請輸入資料';
        return;
      }
      const options = {params: {code: this.query}};
      try {
        const xhr = await this.$axios.get("application", options);
        this.application = xhr.data;
        this.status = "";
      } catch (e) {
        this.application = {};
        if (e?.response?.status !== 404) {
          this.status = "發生嚴重錯誤";
          return;
        }
        this.status = "加入代碼不存在"
      }
    },
    async approval() {
      const options = {params: {
        code: this.query,
        state: "true",
      }};
      try {
        await this.$axios.patch("applications", null, options)
        await this.submit()
      } catch (e) {
        console.error(e)
      }
    },
    async reject() {
      const options = {params: {
        code: this.query,
        state: "false",
      }};
      try {
        await this.$axios.patch("applications", null, options)
        this.application = {}
      } catch (e) {
        console.error(e)
      }
    }
  },
  computed: {
    uaParsed() {
      const {
        userAgent: uaString,
      } = this.application;
      return uaParser(uaString);
    },
    dateParsedCreatedAt() {
      const {
        createdAt,
      } = this.application;
      return this.dateToHuman(
        createdAt,
      );
    },
    dateParsedApprovalAt() {
      const {
        commitAt,
      } = this.application;
      return this.dateToHuman(
        commitAt,
      );
    },
  },
  async created() {
    this.profile = this.$profile();
    if (!this.profile) {
      const refer = `${process.env.VUE_APP_SELF_HOST}/#/admin/join`;
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
      console.warn("Forbidden")
    }
    this.ready = true;
  }
}
</script>
