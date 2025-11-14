// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: '%s - OpenChat Hub',
      title: 'OpenChat Hub',
    }
  },

  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  colorMode: { preference: 'light' },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
  ],

  runtimeConfig: {
    public: {
      selfHost: 'https://web-tech.tw/openchat',
      ocjiHost: 'https://web-tech.tw/recv/openchat',
      saraInteHost: 'https://web-tech.tw/sara',
      saraTokenName: 'unified_token',
      turnstileSiteKey: '0x4AAAAAAAr6LY1hBUbTBkVA',
      zebraTokenName: 'zebra',
    }
  }
})
