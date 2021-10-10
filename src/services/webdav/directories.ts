import webdav from "@/services/webdav";
import { FileStat, ResponseDataDetailed } from "webdav";

// ver se não tem 404
export function listDirectories(userId: string | number, path?: string): any {
  return webdav().getDirectoryContents(`${userId}/${path}`, { details: true });
}

export function existDirectory(userId: string | number, remotePath: string) {
  try {
    return webdav().exists(`${userId}/${remotePath}`);
  } catch (err) {
    console.log(err.response);
  }
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

export function deleteDirectory(userId: string | number, filename: string) {
  try {
    return webdav().deleteFile(`${userId}/${filename}`);
  } catch (err) {
    console.log(err);
    console.log("aqui mais um ", err);
  }
}
