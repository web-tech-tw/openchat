# Template INTE

網頁客戶端 | [伺服器端](https://github.com/web-tech-tw/template.recv)

本系統為本組織的通用網頁客戶端範本，為敏捷開發而生。

本系統採用 vue.js 3 + tailwindcss + vite 打造，內建通用樣式模板，並擴充了許多功能。

## 系統架構

本系統採用 vue.js 打造，推薦於 `node.js 18` 以上版本開發與編譯本系統。

## 系統設定

### 安裝相依套件

本專案使用 Node.js 作為開發環境，請先安裝 Node.js。

該指令會安裝專案所需的相依套件。

```sh
npm install
```

### 開發除錯模式

該指令會啟動開發除錯模式，可配合瀏覽器進行開發。當網頁變動時，會自動重新載入。

```sh
npm run dev
```

### 正式產品模式

該指令會將專案編譯成正式產品模式，壓縮檔案並進行最佳化，最後輸出至 `dist` 目錄。

```sh
npm run build
```

## 開放原始碼授權

本專案採用 MIT 開放原始碼授權。

詳細可參閱 [LICENSE](LICENSE) 檔案。

---

&copy; [Taiwan Web Technology Promotion Organization](https://web-tech.tw)
