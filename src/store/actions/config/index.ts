import { SET_CURRENT_PAGE, SET_CHANGED_LANGUAGE } from "@/store/actions/index";

export const setCurrentPage = (currentPage: string) => ({
  type: SET_CURRENT_PAGE,
  currentPage,
});

export const setChangedLanguage = (isChangedLanguage: boolean) => ({
  type: SET_CHANGED_LANGUAGE,
  isChangedLanguage,
});
