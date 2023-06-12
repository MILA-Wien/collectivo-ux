/// <reference types="vitest" />
// line above solves error below: https://stackoverflow.com/a/72149404/19932351
import federation from "@originjs/vite-plugin-federation";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "layout",
      filename: "remoteEntry.js",
      remotes: {
        a: {
          external: `Promise.resolve(window.RemoteURLs.a)`,
          from: "vite",
          externalType: "promise",
        },
        b: {
          external: `Promise.resolve(window.RemoteURLs.b)`,
          from: "vite",
          externalType: "promise",
        },
        c: {
          external: `Promise.resolve(window.RemoteURLs.c)`,
          from: "vite",
          externalType: "promise",
        },
        d: {
          external: `Promise.resolve(window.RemoteURLs.d)`,
          from: "vite",
          externalType: "promise",
        },
        e: {
          external: `Promise.resolve(window.RemoteURLs.e)`,
          from: "vite",
          externalType: "promise",
        },
        f: {
          external: `Promise.resolve(window.RemoteURLs.f)`,
          from: "vite",
          externalType: "promise",
        },
        g: {
          external: `Promise.resolve(window.RemoteURLs.g)`,
          from: "vite",
          externalType: "promise",
        },
        h: {
          external: `Promise.resolve(window.RemoteURLs.h)`,
          from: "vite",
          externalType: "promise",
        },
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
