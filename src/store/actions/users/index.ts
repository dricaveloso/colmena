import { USER_UPDATE, USER_UPDATE_PASSWORD, SET_INVITATION_TOKEN } from "@/store/actions/index";

export const userUpdate = (user: any) => ({
  type: USER_UPDATE,
  payload: user,
});

export const userUpdatePassword = (password: string) => ({
  type: USER_UPDATE_PASSWORD,
  password,
});

export const setInvitationToken = (invitationToken: { invitationToken: string | undefined }) => ({
  type: SET_INVITATION_TOKEN,
  payload: invitationToken,
});
