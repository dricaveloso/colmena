import { SET_CHANGED_LANGUAGE } from "@/store/actions/index";

export const setChangedLanguage = (isChangedLanguage: boolean) => ({
  type: SET_CHANGED_LANGUAGE,
  isChangedLanguage,
});
