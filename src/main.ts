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
import { initKeycloak } from "./helpers/keycloak";
// init keycloak
const i18n = setupI18n();
const app = createApp(App);
app.use(createPinia());
const keycloakInstance = initKeycloak();
keycloakInstance
  .then((keycloak) => {
    console.log("keycloakInstance", keycloak);
    app.use(i18n);
    // PrimeVue
    app.use(PrimeVue);
    app.use(ToastService);
    app.component("InputTextPrime", InputTextPrime);
    app.component("ButtonPrime", Button);
    app.component("PasswordPrime", PasswordPrime);
    app.component("PrimeMenu", Menu);
    app.component("ToastPrime", Toast);

    // init translations
    loadLocaleMessages(i18n, "en");
    loadLocaleMessages(i18n, "de");
    setI18nLanguage(i18n, "de");

    app.use(router);
    app.mount("#app");
  })
  .catch((e) => {
    console.log("error", e);
  });
