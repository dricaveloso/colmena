import { SET_CURSOR_SELECTED } from "@/store/actions/index";

export const setCursorSelected = (isCursorSelected: boolean) => ({
  type: SET_CURSOR_SELECTED,
  isCursorSelected,
});
