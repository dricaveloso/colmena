import { SET_CHANGED_LANGUAGE } from "@/store/actions/index";

type initialStateProps = {
  currentPage: string;
  isChangedLanguage: boolean;
};

const initialState: initialStateProps = {
  currentPage: "",
  isChangedLanguage: false,
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_CHANGED_LANGUAGE:
      return {
        ...state,
        isChangedLanguage: action.isChangedLanguage,
      };
    default:
      return state;
  }
};

export default reducer;
