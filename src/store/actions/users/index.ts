import { USER_UPDATE, TOKEN_UPDATE } from "@/store/actions/index";

export const userUpdate = (user: any) => ({
  type: USER_UPDATE,
  payload: user,
});

export const tokenUpdate = (token: string) => ({
  type: TOKEN_UPDATE,
  payload: token,
});
