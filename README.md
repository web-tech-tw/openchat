# openchat

由 臺灣網際網路技術推廣組織 所管理的 LINE社群 列表

## 系統架構 System Architecture

本專案採用 Nuxt 4 + Vue 3 + Tailwind CSS 打造，基於 [@web-tech-tw/wings](https://github.com/web-tech-tw/wings) 架構。

This project is built with Nuxt 4 + Vue 3 + Tailwind CSS, based on the [@web-tech-tw/wings](https://github.com/web-tech-tw/wings) architecture.

### 技術棧 Tech Stack

- **Nuxt 4**: 全端 Vue.js 框架，提供 SSR/SSG 支援
- **Vue 3**: 使用 Composition API
- **@nuxt/ui**: UI 元件庫
- **@nuxt/image**: 圖片最佳化
- **Tailwind CSS**: 工具類優先的 CSS 框架
- **TypeScript**: 型別安全支援

## 專案設定 Setup

### 安裝相依套件 Install Dependencies

```bash
npm install
```

### 開發除錯模式 Development Mode

```bash
npm run dev
```

### 正式產品模式 Production Build

```bash
npm run build
```

### 本機預覽 Local Preview

```bash
npm run preview
```

### 產生社群 QR Code Generate Community QR Codes

```bash
npm run generate-chats-qr
```
