const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  pages: {
    index: {
      title: 'Taiwan Web Technology Promotion Organization 臺灣網際網路技術推廣組織',
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    }
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/openchat/' : '/',
  transpileDependencies: true
})
