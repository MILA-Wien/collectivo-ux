/// <reference types="vitest" />
// line above solves error below: https://stackoverflow.com/a/72149404/19932351
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "layout",
      filename: "remoteEntry.js",
      remotes: {
        test_extension:
          "http://collectivo.local:8000/static/test_extension/remoteEntry.js",
        members: "http://collectivo.local:8000/static/members/remoteEntry.js",
      },
      shared: ["vue", "pinia"],
    }),
  ],
  resolve: {
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
  optimizeDeps: {
    include: ["vue-flex-waterfall"],
  },
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue"],
          pinia: ["pinia"],
        },
      },
    },
  },
});
