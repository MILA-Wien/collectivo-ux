import { createApp } from "vue";
import { createPinia } from "pinia";
import { setupI18n, loadLocaleMessages, setI18nLanguage } from "@/locales/i18n";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

//PrimeVue imports
import PrimeVue from "primevue/config";
import ButtonPrime from "primevue/button";
import InputTextPrime from "primevue/inputtext";
import PasswordPrime from "primevue/password";

import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import { initKeycloak } from "./helpers/keycloak";

const app = createApp(App);
app.use(createPinia());


// PrimeVue
app.use(PrimeVue);
app.component("InputTextPrime", InputTextPrime);
app.component("ButtonPrime", ButtonPrime);
app.component("PasswordPrime", PasswordPrime);

// init translations
const i18n = setupI18n();
app.use(i18n);
loadLocaleMessages(i18n, "en");
loadLocaleMessages(i18n, "de");
setI18nLanguage(i18n, "de");

// init keycloak
initKeycloak();

app.use(router);
app.mount("#app");
