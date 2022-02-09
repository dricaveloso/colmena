import { enUS, es, fr, ptBR, arDZ } from "date-fns/locale";

export default {
  APP_NAME: "Colmena",
  APP_DESCRIPTION: "Open collaborative tools to create and share",
  LOCALES: { en: "en", es: "es", fr: "fr", ar: "ar", pt: "pt", sw: "sw" },
  LOCALES_NEXTCLOUD: { en: "en", es: "es", fr: "fr", ar: "ar", pt: "pt_BR", sw: "en" },
  LOCALES_DATE_FNS: { en: enUS, es, fr, ar: arDZ, pt: ptBR, sw: enUS },
  DEFAULT_LANGUAGE: "en",
  TOKEN_EXPIRE_SECONDS: 60 * 60,
};
