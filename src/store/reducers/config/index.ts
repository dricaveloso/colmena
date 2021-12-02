import { SET_CURRENT_PAGE } from "@/store/actions/index";

type initialStateProps = {
  currentPage: string;
  lastTwoPagesAccessed: string[];
};

const initialState: initialStateProps = {
  currentPage: "",
  lastTwoPagesAccessed: [],
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_CURRENT_PAGE: {
      let ltpa = state.lastTwoPagesAccessed || [];
      ltpa.unshift(action.currentPage);
      ltpa = ltpa.slice(0, 2);
      return {
        ...state,
        currentPage: action.currentPage,
        lastTwoPagesAccessed: ltpa,
      };
    }
    default:
      return state;
  }
};

export default reducer;
