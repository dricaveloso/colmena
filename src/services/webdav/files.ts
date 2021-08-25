import webdav from "@/services/webdav";
import { FileStat, ResponseDataDetailed } from "webdav";
// ver se não tem 404
export function listFiles(
  userId: string | number,
): Promise<Array<FileStat> | ResponseDataDetailed<Array<FileStat>>> {
  return webdav().getDirectoryContents(`${userId}/`);
}
