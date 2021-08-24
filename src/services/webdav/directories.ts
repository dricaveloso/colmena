import webdav from "@/services/webdav";
import { initializeStore } from "@/store/index";

// export default async function createDirectory() {
//   const { user } = initializeStore({}).getState().user;
//   const createFolder = await webdav().createDirectory(`${user.id}/nameFolder`);
//   // return createFolder;
//   console.log(createFolder);
// }
async function directory() {
  const { user } = initializeStore({}).getState().user;
  const createFolder = await webdav().createDirectory(`${user.id}/nameFolder`);
  return createFolder;
}
export default directory;
