import ocs from "@/services/ocs";
import gfolders from "@/services/gfolders";

// import ocs from ".";

export function listAllGroups() {
  return ocs()
    .get(`/cloud/groups`)
    .then((response) => {
      console.log(response.data.ocs.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function createOneGroup() {
  return ocs()
    .post(`/cloud/groups`, { groupid: "devteam57" })
    .then((response) => {
      console.log(response.data.ocs);
    })
    .catch((error) => {
      console.log(error);
    });
}
export function createGroupFolders() {
  return gfolders()
    .post("/cloud/folders", {
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
    .get("/cloud/folders")
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function givGroupFoldersAGroup(groupid: number) {
  return gfolders()
    .post(`/cloud/folders/${groupid}/groups`, {
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
    .post(`/cloud/folders/${groupid}/quota`, {
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
  return ocs().get("/cloud/users");
}

export function setGroupOneUser(userid: string) {
  return ocs().post(`/cloud/users/${userid}/groups`, {
    groupid: "devteam57",
  });
}

export function suadminGroup(userid: string) {
  return ocs().post(`/cloud/users/${userid}/subadmins`, {
    groupid: "devteam57",
  });
}
export function listAllTalks() {
  return ocs().get(`apps/spreed/api/v3/room`);
}

export function createTalk(roomName: string, roomType: number) {
  return ocs().post(`apps/spreed/api/v3/room`, { roomName, roomType });
}
export function addGroupConversation(tokenTalk: string, newParticipant: string, source: string) {
  return ocs().post(`apps/spreed/api/v3/room/${tokenTalk}/participants`, {
    newParticipant,
    source,
  });
}
export function listUsersConversation(tokenTalk: string) {
  return ocs().get(`apps/spreed/api/v3/room/${tokenTalk}/participants`);
}
