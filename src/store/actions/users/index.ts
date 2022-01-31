import {
  USER_UPDATE,
  USER_INFO_UPDATE,
  SET_INVITATION_TOKEN,
  MEDIA_INFO_UPDATE,
} from "@/store/actions/index";
import { UserInfoUpdateInterface, MediaInfoInterface } from "@/interfaces/index";

export const userUpdate = (user: any) => ({
  type: USER_UPDATE,
  payload: user,
});

export const userInfoUpdate = (userInfo: UserInfoUpdateInterface) => ({
  type: USER_INFO_UPDATE,
  payload: userInfo,
});

export const mediaInfoUpdate = (mediaInfo: MediaInfoInterface) => ({
  type: MEDIA_INFO_UPDATE,
  payload: mediaInfo,
});

export const setInvitationToken = (invitationToken: { invitationToken: string | undefined }) => ({
  type: SET_INVITATION_TOKEN,
  payload: invitationToken,
});
