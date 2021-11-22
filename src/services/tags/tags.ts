// import { ListAllInterface } from "@/interfaces/tags";
// import tags from "@/services/tags";
// import axios from "axios";
// import { initializeStore } from "@/store/index";

// export function listAllTags(): ListAllInterface {
//   const data =
//     "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<a:propfind xmlns:a=\"DAV:\" xmlns:oc=\"http://owncloud.org/ns\">\n  <a:prop>\n    <!-- Retrieve the display-name, user-visible, and user-assignable properties -->\n    <oc:display-name/>\n    <oc:user-visible/>\n    <oc:user-assignable/>\n    <oc:id/>\n  </a:prop>\n</a:propfind>";
//   const { password, id: username } = initializeStore({}).getState().user.user;
//   const config = {
//     method: "propfind",
//     // Authorization: {
//     //   username,
//     //   password,
//     // },
//     url: `${process.env.NEXT_PUBLIC_API_BASE_URL}remote.php/dav/systemtags`,
//     headers: {
//       "OCS-APIRequest": "true",
//       "Content-Type": "application/xml",
//       Authorization: "Basic YWRtaW46MzU3N3VtVFVTRDJxdmIz",
//     },
//     data,
//   };
//   axios(config)
//     .then((response) => {
//       console.log(JSON.stringify(response.data));
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }
