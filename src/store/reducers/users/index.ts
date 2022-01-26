import {
  USER_UPDATE,
  USER_INFO_UPDATE,
  SET_INVITATION_TOKEN,
  MEDIA_INFO_UPDATE,
} from "@/store/actions/index";
import { UserInfoInterface, UserInfoUpdateInterface } from "@/interfaces/index";

type initialStateProps = {
  user: UserInfoInterface | UserInfoUpdateInterface | null;
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
    case USER_INFO_UPDATE:
      return { ...state, user: { ...state.user, ...action.payload } };
    case MEDIA_INFO_UPDATE:
      return { ...state, user: { ...state.user, media: { ...action.payload } } };
    case SET_INVITATION_TOKEN:
      return { ...state, invitationToken: action.payload.invitationToken };
    default:
      return state;
  }
};

export default reducer;
