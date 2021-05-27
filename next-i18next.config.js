const Backend = require("i18next-http-backend");
const LanguageDetector = require("i18next-browser-languagedetector");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "fr"],
    fallbackLng: "es",
  },
  serializeConfig: false,
  use: [Backend, LanguageDetector],
};
