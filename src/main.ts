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

// Import settings and extensions
const settings: any = await import("./collectivo.json");
const extension_imports = [];
for (const extension of settings.extensions) {
  const extensionModule = import(`./extensions/${extension}/extension.ts`);
  extension_imports.push(extensionModule);
}
const extensions_promise = Promise.allSettled(extension_imports);

// init vue app
const app = createApp(App);
app.use(createPinia());

// init keycloak
const keycloakInstance = initKeycloak();
keycloakInstance
  .then(() => {
    // init i18n (translations)
    //@ts-ignore
    window.translate = (key) => {
      return i18n.global.t(key)
    }
    app.use(i18n);
    loadLocaleMessages(i18n, "en");
    loadLocaleMessages(i18n, "de");
    setI18nLanguage(i18n, "de");

    // init PrimeVue
    app.use(PrimeVue);
    app.use(ToastService);
    app.use(ConfirmationService);
    app.directive("tooltip", PrimeTooltip);

    //init the extensions
    extensions_promise.then((extensions) => {
      for (const extension of extensions) {
        if (extension.status === "fulfilled") {
          extension.value.default();
        }
      }

      // init view router
      app.use(router);

      // Render app
      app.mount("#app");
    });
  })
  .catch((e) => {
    console.log("error", e);
  });
