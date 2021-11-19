import { SET_CURRENT_PAGE } from "@/store/actions/index";

export const setCurrentPage = (currentPage: string) => ({
  type: SET_CURRENT_PAGE,
  currentPage,
});
