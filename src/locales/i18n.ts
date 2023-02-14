import { nextTick } from "vue";
import { createI18n } from "vue-i18n";

export const SUPPORT_LOCALES = ["en", "de"];

export function setupI18n(
  options = {
    locale: "en",
    legacy: false,
    fallbackWarn: false,
    missingWarn: false,
  }
) {
  const i18n = createI18n(options);
  setI18nLanguage(i18n, options.locale);
  return i18n;
}

export default setupI18n();

export function setI18nLanguage(i18n: any, locale: any) {
  if (i18n.mode === "legacy") {
    i18n.global.locale = locale;
  } else {
    i18n.global.locale.value = locale;
  }
}

export async function loadLocaleMessages(i18n: any, locale: any) {
  // load locale messages with dynamic import
  import(`./locales/${locale}.json`)
    .catch((e) => {
      console.log("error", e, locale);
    })
    .then((messages) => {
      if (messages) {
        // set locale and locale message
        i18n.global.setLocaleMessage(locale, messages.default);

        return nextTick();
      }
    });
}
