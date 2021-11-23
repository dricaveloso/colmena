import ocs from "@/services/ocs";
import gfolders from "@/services/gfolders";

// import ocs from ".";

export function listAllGroups() {
  return ocs()
    .get(`groups`)
    .then((response) => {
      console.log(response.data.ocs.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function createOneGroup() {
  return ocs()
    .post(`groups`, { groupid: "devteam57" })
    .then((response) => {
      console.log(response.data.ocs);
    })
    .catch((error) => {
      console.log(error);
    });
}
export function createGroupFolders() {
  return gfolders()
    .post("/folders", {
      mountpoint: "devteam57",
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}
export function listGroupFolders() {
  return gfolders()
    .get("/folders")
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function givGroupFoldersAGroup(groupid: number) {
  return gfolders()
    .post(`/folders/${groupid}/groups`, {
      group: `devteam57`,
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}
export function quotaGroupFolders(groupid: number) {
  return gfolders()
    .post(`/folders/${groupid}/quota`, {
      quota: 10737412742,
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}
export function listUsers() {
  return ocs().get("/users");
}
export function createOneUser() {
  return ocs().post("/users", {
    userid: "Myriam Teste",
    email: "test-8e7836@test.mailgenius.com",
    password: "colmena@123",
    quota: "1 GB",
  });
}
export function setGroupOneUser(userid: string) {
  return ocs().post(`/users/${userid}/groups`, {
    groupid: "devteam57",
  });
}
export function listGroupOneUser(userid: string) {
  return ocs().get(`/users/${userid}/groups`);
}
export function suadminGroup(userid: string) {
  return ocs().post(`/users/${userid}/subadmins`, {
    groupid: "devteam57",
  });
}
export function listOneUser(userid: string) {
  return ocs().get(`/users/${userid}`);
}
