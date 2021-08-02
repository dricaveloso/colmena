import { USER_UPDATE, SET_INVITATION_TOKEN } from "@/store/actions/index";

export const userUpdate = (user: any) => ({
  type: USER_UPDATE,
  payload: user,
});

export const setInvitationToken = (invitationToken: { invitationToken: string | undefined }) => ({
  type: SET_INVITATION_TOKEN,
  payload: invitationToken,
});
