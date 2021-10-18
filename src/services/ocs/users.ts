import ocs from "@/services/ocs";
import axios from "axios";
import {
  CreateUserInterface,
  WelcomeUserInterface,
  SetPasswordInterface,
  UpdatePasswordInterface,
} from "@/interfaces/ocs";
import constants from "@/constants/index";

export function listAllUsers() {
  try {
    return ocs().get(`/users`);
  } catch (err) {
    console.log(err.response);
    return false;
  }
}
export function listOneUser(userId: string | number) {
  try {
    return ocs().get(`/users/${userId}`);
  } catch (error) {
    if (error) {
      return false;
    }
  }
  return true;
}

export function enableUser(userId: string | number) {
  try {
    ocs().put(`/users/${userId}/enable`);
  } catch (error) {
    if (error) {
      return false;
    }
  }
  return true;
}

export function disableUser(userId: string | number) {
  try {
    ocs().put(`/users/${userId}/disable`);
  } catch (error) {
    if (error) {
      return false;
    }
  }
  return true;
}

export function welcomeUser(userId: string | number): Promise<WelcomeUserInterface> {
  return ocs().post(`/users/${userId}/welcome`);
}

export function createUser(
  displayName: string,
  email: string,
  groups: string[],
  password = constants.DEFAULT_PASSWORD_NEW_USER,
): Promise<CreateUserInterface> {
  return ocs().post(`/users`, {
    userid: email.split("@")[0],
    displayName,
    email,
    groups,
    password,
  });
}
export function deleteUser(userId: string | number) {
  try {
    ocs().delete(`/users/${userId}`);
  } catch (error) {
    if (error) {
      return false;
    }
  }
  return true;
}

export function updatePassword(
  userId: string,
  password: string | number,
  oldPassword: string = constants.DEFAULT_PASSWORD_NEW_USER,
): Promise<UpdatePasswordInterface> {
  return axios.put(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/ocs/v2.php/cloud/users/${userId}?format=json`,
    {
      key: "password",
      value: password,
    },
    {
      headers: {
        "OCS-APIRequest": true,
      },
      auth: {
        username: userId,
        password: oldPassword,
      },
    },
  );
}

export function setPassword(
  token: string,
  userId: string,
  password: string,
  headers: {
    Cookie: string;
    requesttoken: string;
  },
): Promise<SetPasswordInterface> {
  return axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/index.php/lostpassword/set/${token}/${userId}`,
    {
      password,
      proceed: false,
    },
    {
      headers,
    },
  );
}

export function listGroupsUser(userId: string | number) {
  try {
    return ocs().get(`/users/${userId}/groups`);
  } catch (error) {
    if (error) {
      return false;
    }
  }
  return true;
}
