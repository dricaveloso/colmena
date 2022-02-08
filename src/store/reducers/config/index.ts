import { SET_CURRENT_PAGE, SET_CHANGED_LANGUAGE } from "@/store/actions/index";

type initialStateProps = {
  currentPage: string;
  isChangedLanguage: boolean;
  lastTwoPagesAccessed: string[];
};

const initialState: initialStateProps = {
  currentPage: "",
  lastTwoPagesAccessed: [],
  isChangedLanguage: false,
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_CHANGED_LANGUAGE:
      return {
        ...state,
        isChangedLanguage: action.isChangedLanguage,
      };
    case SET_CURRENT_PAGE: {
      const ltpa = state.lastTwoPagesAccessed;

      ltpa.unshift(action.currentPage);
      const arr = [...new Set(ltpa)];
      // ltpa = ltpa.filter(onlyUnique);
      // ltpa = ltpa.slice(0, 2);

      console.log(arr);

      return {
        ...state,
        currentPage: action.currentPage,
        lastTwoPagesAccessed: arr,
      };
    }
    default:
      return state;
  }
};

export default reducer;
