import group from "@/services/group";

export function listAllGroups() {
  return group()
    .get(`/groups`)
    .then((response) => {
      // handle success
      console.log(response);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
}
export function createGroup(groupid: string) {
  return group()
    .post(`/groups/${groupid}`)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
}
