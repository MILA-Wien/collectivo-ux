import { createApp } from "vue";
import { createPinia } from "pinia";
import { initKeycloak } from "./helpers/keycloak";
import { setupI18n, loadLocaleMessages, setI18nLanguage } from "@/locales/i18n";
import i18n from '@/locales/i18n';
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";

//PrimeVue imports
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons

// init vue app
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
    app.use(ConfirmationService);

    // init view router
    app.use(router);

    // Render app
    app.mount("#app");
  })
  .catch((e) => {
    console.log("error", e);
  });
