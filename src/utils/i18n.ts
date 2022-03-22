import { parseCookies } from "nookies";

export const FALLBACK_LANG = "es";
export const SUPPORTED_LANGUAGES = ["fr", "en", "es", "pt"];
const cookies = parseCookies();
const language = cookies.NEXT_LOCALE || "en";
export const currentDirection = () => (["ar", "he"].includes(language) ? "rtl" : "ltr");
