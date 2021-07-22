import { USER_UPDATE, TOKEN_UPDATE } from "@/store/actions/index";

const initialState = {
  user: null,
  token: null,
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case USER_UPDATE:
      return { ...state, user: action.payload.user };
    case TOKEN_UPDATE:
      return { ...state, token: action.payload.token };
    default:
      return state;
  }
};

export default reducer;
