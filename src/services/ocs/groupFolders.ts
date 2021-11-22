import ocs from "@/services/ocs";

// import ocs from ".";

export function listAllGroups() {
  return ocs()
    .get(`groups`)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function createOneGroup() {
  return ocs()
    .post(`groups`)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
