import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLang from "./locales/en/en.json";
import itLang from "./locales/it/it.json";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: enLang,
  },
  it: {
    translation: itLang,
  },
};

i18n
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "it"],
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"]
    },
    nonExplicitSupportedLngs: true,

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
