import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const base = process.env.BASE_URL || "/";

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [vue()],
});
