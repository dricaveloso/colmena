import { SET_CURSOR_SELECTED } from "@/store/actions/index";

type initialStateProps = {
  isCursorSelected: boolean;
};

const initialState: initialStateProps = {
  isCursorSelected: false,
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_CURSOR_SELECTED:
      return {
        ...state,
        isCursorSelected: action.isCursorSelected,
      };
    default:
      return state;
  }
};

export default reducer;
