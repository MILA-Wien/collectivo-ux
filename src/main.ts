import { createApp } from "vue";
import { createPinia } from "pinia";
import { initKeycloak } from "./helpers/keycloak";
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
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons

// init vue app
const i18n = setupI18n();
const app = createApp(App);
app.use(createPinia());

// init keycloak
const keycloakInstance = initKeycloak();
keycloakInstance
  .then(() => {
    app.use(i18n);
    loadLocaleMessages(i18n, "en");
    loadLocaleMessages(i18n, "de");
    setI18nLanguage(i18n, "de");

    // init PrimeVue
    app.use(PrimeVue);
    app.use(ToastService);
    app.component("InputTextPrime", InputTextPrime);
    app.component("ButtonPrime", Button);
    app.component("PasswordPrime", PasswordPrime);
    app.component("PrimeMenu", Menu);
    app.component("ToastPrime", Toast);
    app.component("Dropdown", Dropdown);
    app.component("Dialog", Dialog);

    // init view router
    app.use(router);

    // Render app
    app.mount("#app");
  })
  .catch((e) => {
    console.log("error", e);
  });
