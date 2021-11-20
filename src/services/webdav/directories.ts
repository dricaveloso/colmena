import webdav from "@/services/webdav";
import { removeFirstSlash } from "@/utils/utils";
import { FileStat } from "webdav";

// ver se não tem 404
export function listDirectories(userId: string | number, path?: string): any {
  return webdav().getDirectoryContents(`${userId}/${removeFirstSlash(path)}`, { details: true });
}

export async function listLibraryDirectories(userId: string | number, path?: string): Promise<any> {
  const directories = await listDirectories(userId, path);
  if (directories && (path === "/" || path === "")) {
    directories.data = directories.data.filter((item: FileStat) => {
      if (item.basename[0] === ".") return false;
      if (item.type !== "directory") return false;

      const blacklistNames = ["talk"];
      if (blacklistNames.includes(item.basename.toLowerCase())) {
        return false;
      }

      return true;
    });
  }

  return directories;
}

export function existDirectory(userId: string | number, remotePath: string): Promise<boolean> {
  try {
    return webdav().exists(`${userId}/${removeFirstSlash(remotePath)}`);
  } catch (err) {
    console.log(err.response);
  }

  return Promise.resolve(true);
}

export async function createDirectory(userId: string | number, dirPath: string): Promise<boolean> {
  try {
    await webdav().createDirectory(`${userId}/${removeFirstSlash(dirPath)}`);
  } catch (error) {
    if (error) {
      return Promise.resolve(false);
    }
  }

  return Promise.resolve(true);
}

export async function deleteDirectory(userId: string | number, filename: string): Promise<boolean> {
  try {
    await webdav().deleteFile(`${userId}/${removeFirstSlash(filename)}`);
  } catch (err) {
    return Promise.resolve(false);
  }

  return Promise.resolve(true);
}
