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
import "primevue/resources/themes/saga-blue/theme.css"; //theme
import ToastService from "primevue/toastservice";
import PrimeTooltip from "primevue/tooltip";

// init vue app
const app = createApp(App);
app.use(createPinia());

// init keycloak
const keycloakInstance = initKeycloak();
keycloakInstance
  .then(() => {
    loadLocaleMessages(i18n, "en");
    loadLocaleMessages(i18n, "de").then(() => {
      setI18nLanguage(i18n, "de");
    });
    app.use(i18n);

    // init PrimeVue
    app.use(PrimeVue);
    app.use(ToastService);
    app.use(ConfirmationService);
    app.directive("tooltip", PrimeTooltip);

    // init view router
    app.use(router);

    // Render app
    app.mount("#app");
  })
  .catch((e) => {
    console.log("error", e);
  });
