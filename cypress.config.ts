import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,

  e2e: {
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    baseUrl: "http://collectivo.local:4173",
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
