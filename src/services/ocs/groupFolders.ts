// // import ocs from "@/services/ocs";
// import gfolders from "@/services/gfolders";

// // import ocs from ".";

// export function listAllGroups() {
//   return ocs()
//     .get(`groups`)
//     .then((response) => {
//       console.log(response);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }

// // export function createOneGroup(groupid: string) {
// //   return ocs()
// //     .post(`groups`)
// //     .then((response) => {
// //       console.log(response);
// //     })
// //     .catch((error) => {
// //       console.log(error);
// //     });
// // }
// export function createGroupFolders(mountpoint: string) {
//   return gfolders()
//     .post(`/${mountpoint}`)
//     .then((response) => {
//       console.log(response);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }
