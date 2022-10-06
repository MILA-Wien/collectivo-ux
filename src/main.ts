import { createApp, defineAsyncComponent  } from "vue";
import { createPinia } from "pinia";
import { setupI18n, loadLocaleMessages, setI18nLanguage } from "@/locales/i18n";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);
const i18n = setupI18n();
loadLocaleMessages(i18n, "en");
loadLocaleMessages(i18n, "de");
setI18nLanguage(i18n, "de");

app.use(i18n);
app.use(createPinia());
app.use(router);

app.mount("#app");
