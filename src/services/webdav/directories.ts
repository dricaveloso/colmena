import webdav from "@/services/webdav";
import { initializeStore } from "@/store/index";
import { DirectoryItemInterface } from "@/interfaces/index";
import { FileStat, ResponseDataDetailed } from "webdav";
// export default async function listAllDirectories() {
//   const { user } = initializeStore({}).getState().user;
//   // const createFolder = await webdav().createDirectory(`${user.id}/nameFolder9`);
//   const contentsAll = await webdav().getDirectoryContents(`${user.id}/`, { deep: true });
//   console.log(contentsAll);
//   return contentsAll;
// }
export function listAllDirectories(
  userId: string | number,
): Promise<Array<FileStat> | ResponseDataDetailed<Array<FileStat>>> {
  return webdav().getDirectoryContents(`${userId}/`, { deep: true });
}
// export function createFile(

// )
