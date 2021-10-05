import ocs from "@/services/ocs";
import { CreateUserInterface, WelcomeUserInterface } from "@/interfaces/ocs";

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
  groups = ["users"],
): Promise<CreateUserInterface> {
  return ocs().post(`/users`, {
    userid: email.split("@")[0],
    displayName,
    email,
    groups,
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

export function resetPass(userId: string | number, password: string | number) {
  try {
    return ocs().put(`/users/${userId}`, {
      password: `${password}`,
    });
  } catch (error) {
    if (error) {
      return false;
    }
  }
  return true;
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
