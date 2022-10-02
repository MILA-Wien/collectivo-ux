import { createApp } from "vue";
import { createPinia } from "pinia";
import { setupI18n, loadLocaleMessages, setI18nLanguage } from "@/locales/i18n";
import PrimeVue from "primevue/config";
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';


import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import "primevue/resources/themes/saga-blue/theme.css"       //theme
import "primevue/resources/primevue.min.css"                 //core css
import "primeicons/primeicons.css"                           //icons

const app = createApp(App);
const i18n = setupI18n();
loadLocaleMessages(i18n, "en");
loadLocaleMessages(i18n, "de");
setI18nLanguage(i18n, "de");

app.use(i18n);
app.use(createPinia());
app.use(router);
app.use(PrimeVue);
app.component('Dialog', Dialog);
app.component('Button', Button);

app.mount("#app");
