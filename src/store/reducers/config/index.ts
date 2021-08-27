import { SET_CURRENT_PAGE } from "@/store/actions/index";

type initialStateProps = {
  currentPage: string;
};

const initialState: initialStateProps = {
  currentPage: "",
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_CURRENT_PAGE:
      return { ...state, currentPage: action.currentPage };
    default:
      return state;
  }
};

export default reducer;
