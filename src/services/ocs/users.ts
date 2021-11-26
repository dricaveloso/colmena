import ocs from "@/services/ocs";
import {
  CreateUserInterface,
  WelcomeUserInterface,
  // SetPasswordInterface,
  UserUpdateInterface,
  UsersListInterface,
} from "@/interfaces/ocs";
import useOcsFetch from "@/hooks/useOcsFetch";
import { initializeStore } from "@/store/index";
import axios from "axios";

export function listAllUsers(): UsersListInterface {
  return useOcsFetch("/users?format=json");
}

export function listOneUser(userId: string | number) {
  return ocs().get(`/users/${userId}`);
}

export function enableUser(userId: string | number) {
  return ocs().put(`/users/${userId}/enable`);
}

export function disableUser(userId: string | number) {
  return ocs().put(`/users/${userId}/disable`);
}

export function welcomeUser(userId: string | number): Promise<WelcomeUserInterface> {
  return ocs().post(`/users/${userId}/welcome`);
}

export function createUser(
  displayName: string,
  email: string,
  groups: string[],
  quota: string,
  subadmin?: string[],
  password = process.env.NEXT_PUBLIC_DEFAULT_USER_PASSWORD,
): Promise<CreateUserInterface> {
  return ocs().post(`/users`, {
    userid: email.split("@")[0],
    displayName,
    email,
    groups,
    quota,
    subadmin,
    password,
  });
}
export function deleteUser(userId: string | number) {
  return ocs().delete(`/users/${userId}`);
}

export function updateUser<T>(key: string, value: T): Promise<UserUpdateInterface> {
  const { id: userId } = initializeStore({}).getState().user.user;
  return ocs().put(`/users/${userId}?format=json`, {
    key,
    value,
  });
}

export function resetPassword(userId: string, password: string): Promise<UserUpdateInterface> {
  return axios.put(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/ocs/v2.php/cloud/users/${userId}?format=json`,
    {
      key: "password",
      value: password,
    },
    {
      auth: {
        username: userId,
        password: process.env.NEXT_PUBLIC_DEFAULT_USER_PASSWORD || "",
      },
      headers: {
        "OCS-APIRequest": true,
      },
    },
  );
}

export function listGroupsUser(userId: string | number) {
  return ocs().get(`/users/${userId}/groups`);
}
