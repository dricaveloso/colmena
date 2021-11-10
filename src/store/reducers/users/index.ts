import { USER_UPDATE, USER_UPDATE_PASSWORD, SET_INVITATION_TOKEN } from "@/store/actions/index";
import { UserInfoInterface } from "@/interfaces/index";

type initialStateProps = {
  user: UserInfoInterface | null;
  invitationToken: string | null;
};

const initialState: initialStateProps = {
  user: null,
  invitationToken: null,
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case USER_UPDATE:
      return { ...state, user: action.payload.user };
    case USER_UPDATE_PASSWORD:
      return { ...state, user: { ...state.user, password: action.password } };
    case SET_INVITATION_TOKEN:
      return { ...state, invitationToken: action.payload.invitationToken };
    default:
      return state;
  }
};

export default reducer;
