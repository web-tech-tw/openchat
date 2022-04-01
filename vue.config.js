const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  pages: {
    index: {
      title: 'OpenChat Hub - Web Tech TW',
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    }
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/openchat/' : '/',
  transpileDependencies: true
})
