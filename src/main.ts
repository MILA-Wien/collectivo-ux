import i18n, { loadLocaleMessages, setI18nLanguage } from "@/locales/i18n";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import { initKeycloak } from "./helpers/keycloak";
import router from "./router";
//PrimeVue imports
import "primeicons/primeicons.css"; //icons
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import "primevue/resources/primevue.min.css"; //core css
import "primevue/resources/themes/lara-light-indigo/theme.css";
import ToastService from "primevue/toastservice";
import PrimeTooltip from "primevue/tooltip";
import shifts from "./extensions/shifts/shifts";

// init vue app
const app = createApp(App);
app.use(createPinia());

// init keycloak
const keycloakInstance = initKeycloak();
keycloakInstance
  .then(() => {
    // init view router
    app.use(router);

    loadLocaleMessages(i18n, "en")
      .then(() =>
      // artificially wait 2s before loading german languange
        setTimeout(() => loadLocaleMessages(i18n, "de"), 2000)
      );
    setI18nLanguage(i18n, "de");
    app.use(i18n);
    // init PrimeVue
    app.use(PrimeVue);
    app.use(ToastService);
    app.use(ConfirmationService);
    app.directive("tooltip", PrimeTooltip);

    //init the extensions
    shifts();
    //setTimeout(() => {  app.mount("#app"); }, 3000);
    // Render app
    app.mount("#app");
  })
  .catch((e) => {
    console.log("error", e);
  });
