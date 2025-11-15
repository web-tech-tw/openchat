// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: '%s - Web-Tech-TW',
      title: 'OpenChat Hub',
    }
  },

  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },
  nitro: { preset: 'bun' },

  colorMode: { preference: 'light' },
  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
  ],

  runtimeConfig: {
    public: {
      selfHost: 'https://web-tech.tw/openchat',
      ocjiHost: 'https://web-tech.tw/recv/openchat',
      saraInteHost: 'https://web-tech.tw/sara',
      saraTokenName: 'unified_token',
      turnstileSiteKey: '0x4AAAAAAAr6LY1hBUbTBkVA',
      zebraTokenName: 'zebra',
      homeInteHost: 'https://web-tech.tw',
    }
  }
})
