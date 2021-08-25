import webdav from "@/services/webdav";
import { FileStat, ResponseDataDetailed } from "webdav";

// ver se não tem 404
export function listDirectories(
  userId: string | number,
): Promise<Array<FileStat> | ResponseDataDetailed<Array<FileStat>>> {
  return webdav().getDirectoryContents(`${userId}/`);
}

export function createDirectory(userId: string | number, dirPath: string) {
  try {
    webdav().createDirectory(`${userId}/${dirPath}`);
  } catch (error) {
    if (error) {
      return false;
    }
  }
  return true;
}

export function deleteDirectory(userId: string | number, filename: string): boolean {
  try {
    webdav().deleteFile(`${userId}/${filename}`);
  } catch (error) {
    if (error) {
      return false;
    }
  }
  return true;
}
