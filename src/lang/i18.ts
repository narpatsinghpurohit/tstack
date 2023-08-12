import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
const en = require("./translations/en.json");


i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                ...en
            }
        }
    },
    supportedLngs: ["en"],
    fallbackLng: "en",
    debug: false,
    // Options for language detector
    detection: {
        order: ["localStorage", "cookie", "htmlTag", "path",],
        caches: ["localStorage", "cookie"],
        lookupLocalStorage: "selectedLanguage"
    },
    react: { useSuspense: false },
    backend: {
        loadPath: "./{{lng}}.json",
    },
})

export default i18n;
export const __ = i18n.t;
export const iDirection = i18n.dir();
export const iLanguage = i18n.language;