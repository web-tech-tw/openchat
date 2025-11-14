# openchat

由 臺灣網際網路技術推廣組織 所管理的 LINE社群 列表

## 系統架構 System Architecture

本專案採用 Nuxt 4 + Vue 3 + Tailwind CSS 打造，基於 [@web-tech-tw/wings](https://github.com/web-tech-tw/wings) 架構。

This project is built with Nuxt 4 + Vue 3 + Tailwind CSS, based on the [@web-tech-tw/wings](https://github.com/web-tech-tw/wings) architecture.

### 技術棧 Tech Stack

- **Nuxt 4**: 全端 Vue.js 框架，提供 SSR/SSG 支援
- **Vue 3**: 使用 Composition API
- **Bun**: 快速的 JavaScript 執行環境與套件管理器
- **@nuxt/ui**: UI 元件庫
- **@nuxt/image**: 圖片最佳化
- **Tailwind CSS**: 工具類優先的 CSS 框架
- **TypeScript**: 型別安全支援

## 專案設定 Setup

### 安裝相依套件 Install Dependencies

本專案使用 Bun 作為套件管理器。

This project uses Bun as the package manager.

請先安裝 [Bun](https://bun.sh/)。

Please install [Bun](https://bun.sh/) first.

```bash
bun install
```

### 開發除錯模式 Development Mode

```bash
bun run dev
```

### 正式產品模式 Production Build

```bash
bun run build
```

### 本機預覽 Local Preview

```bash
bun run preview
```

### 產生社群 QR Code Generate Community QR Codes

```bash
bun run generate-chats-qr
```
