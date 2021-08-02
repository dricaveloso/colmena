import { USER_UPDATE, SET_INVITATION_TOKEN } from "@/store/actions/index";
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
    case SET_INVITATION_TOKEN:
      return { ...state, invitationToken: action.payload.invitationToken };
    default:
      return state;
  }
};

export default reducer;
