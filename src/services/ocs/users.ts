import ocs from "@/services/ocs";
import {
  CreateUserInterface,
  WelcomeUserInterface,
  UserUpdateInterface,
  UsersListInterface,
} from "@/interfaces/ocs";
import useOcsFetch from "@/hooks/useOcsFetch";
import { initializeStore } from "@/store/index";
import axios from "axios";
import { RoleUserEnum } from "@/enums/index";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export function listAllUsers(): UsersListInterface {
  return useOcsFetch("/users?format=json");
}
export function listOneUser(userId: string | number) {
  return ocs().get(`/users/${userId}`);
}

export function enableUser(userId: string | number) {
  return ocs().put(`/users/${userId}/enable`);
}

// export function disableUser(userId: string | number) {
//   return ocs().put(`/users/${userId}/disable`);
// }

// export function removeUser(userId: string | number) {
//   return ocs().delete(`/users/${userId}`);
// }

export function welcomeUser(userId: string | number): Promise<WelcomeUserInterface> {
  return ocs().post(`/users/${userId}/welcome`);
}

interface UserObjParams {
  userid: string;
  displayName: string;
  email: string;
  groups: string[];
  password: string;
  subadmin?: string[];
}

export function createUser(
  displayName: string,
  email: string,
  group: string,
  permission: string,
  password = publicRuntimeConfig.user.defaultNewUserPassword || "",
): Promise<CreateUserInterface> {
  const userObj: UserObjParams = {
    userid: email.split("@")[0],
    displayName,
    email,
    groups: [group],
    password,
  };

  if (permission === RoleUserEnum.ADMIN) userObj.subadmin = [group];

  return ocs().post(`/users`, userObj);
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
    `${publicRuntimeConfig.api.baseUrl}/ocs/v2.php/cloud/users/${userId}?format=json`,
    {
      key: "password",
      value: password,
    },
    {
      auth: {
        username: userId,
        password: publicRuntimeConfig.user.defaultNewUserPassword || "",
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
