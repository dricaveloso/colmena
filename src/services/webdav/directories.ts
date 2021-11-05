import webdav from "@/services/webdav";
import { removeFirstSlash } from "@/utils/utils";
import { FileStat } from "webdav";

// ver se não tem 404
export function listDirectories(userId: string | number, path?: string): any {
  return webdav().getDirectoryContents(`${userId}/${removeFirstSlash(path)}`, { details: true });
}

export function getRootPath(): string {
  return "private";
}

export function exclusiveLocalPaths(): Array<string> {
  return ["private/downloads"];
}

export async function listLibraryDirectories(userId: string | number, path?: string): Promise<any> {
  const directories = await listDirectories(userId, path);
  if (directories && (path === "/" || path === "")) {
    directories.data = directories.data.filter((item: FileStat) => {
      const blacklistNames = ["talk"];
      if (item.type !== "directory") {
        return false;
      }

      if (blacklistNames.includes(item.basename.toLowerCase())) {
        return false;
      }

      return true;
    });
  }

  return directories;
}

export function existDirectory(userId: string | number, remotePath: string) {
  try {
    return webdav().exists(`${userId}/${removeFirstSlash(remotePath)}`);
  } catch (err) {
    console.log(err.response);
  }
  return true;
}

export function createDirectory(userId: string | number, dirPath: string) {
  try {
    webdav().createDirectory(`${userId}/${removeFirstSlash(dirPath)}`);
  } catch (error) {
    if (error) {
      return false;
    }
  }
  return true;
}

export function deleteDirectory(userId: string | number, filename: string) {
  try {
    return webdav().deleteFile(`${userId}/${removeFirstSlash(filename)}`);
  } catch (err) {
    console.log(err);
    console.log("aqui mais um ", err);
  }
  return true;
}
