import { createApp } from "vue";
import { createPinia } from "pinia";
import { setupI18n, loadLocaleMessages, setI18nLanguage } from "@/locales/i18n";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

//PrimeVue imports
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import InputTextPrime from "primevue/inputtext";
import PasswordPrime from "primevue/password";
import Menu from "primevue/menu";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";

import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons

const app = createApp(App);
const i18n = setupI18n();
loadLocaleMessages(i18n, "en");
loadLocaleMessages(i18n, "de");
setI18nLanguage(i18n, "de");

app.use(i18n);
app.use(createPinia());
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.component("InputTextPrime", InputTextPrime);
app.component("ButtonPrime", Button);
app.component("PasswordPrime", PasswordPrime);
app.component("PrimeMenu", Menu);
app.component("ToastPrime", Toast);

app.mount("#app");
