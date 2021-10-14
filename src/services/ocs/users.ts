import ocs from "@/services/ocs";

export function listAllUsers() {
  try {
    return ocs().get(`/users`);
  } catch (err) {
    console.log(err.response);
    return false;
  }
}
export function listOneUser(userId: string | number) {
  return ocs().get(`/users/${userId}`);
}

export function enableUser(userId: string | number) {
  ocs().put(`/users/${userId}/enable`);
}

export function disableUser(userId: string | number) {
  ocs().put(`/users/${userId}/disable`);
}

export function welcomeUser(userId: string | number) {
  ocs().post(`/users/${userId}/welcome`);
}

export function createUser(userId: string | number, email: string) {
  ocs().post(`/users`, {
    userid: `${userId}`,
    email: `${email}`,
  });
}
export function deleteUser(userId: string | number) {
  ocs().delete(`/users/${userId}`);
}

export function resetPass(userId: string | number, password: string | number) {
  return ocs().put(`/users/${userId}`, {
    password: `${password}`,
  });
}
export function listGroupsUser(userId: string | number) {
  return ocs().get(`/users/${userId}/groups`);
}
