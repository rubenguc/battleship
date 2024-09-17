import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import es from "./es";

const DEFAULT_LNG = "en";

export default i18next.use(initReactI18next).init({
  resources: {
    en,
    es,
  },
  lng: DEFAULT_LNG,
  fallbackLng: DEFAULT_LNG,

  interpolation: {
    escapeValue: false,
  },
});
