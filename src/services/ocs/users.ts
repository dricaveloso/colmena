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
  try {
    ocs().get(`/users/${userId}`);
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
    ocs().put(`/${userId}/disable`);
  } catch (error) {
    if (error) {
      return false;
    }
  }
  return true;
}

export function welcomeUser(userId: string | number) {
  try {
    ocs().post(`/users/${userId}/welcome`);
    return true;
  } catch (error) {
    if (error) {
      return false;
    }
  }
}

export function createUser(userId: string | number, email: string) {
  try {
    ocs().post(`/users`, {
      userid: `${userId}`,
      email: `${email}`,
    });
  } catch (error) {
    if (error) {
      return false;
    }
  }
}
