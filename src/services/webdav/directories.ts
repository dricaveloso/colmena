import webdav from "@/services/webdav";
import { getTalkPath } from "@/utils/directory";
import { removeCornerSlash, removeFirstSlash } from "@/utils/utils";
import { FileStat } from "webdav";

// ver se não tem 404
export function listDirectories(userId: string | number, path?: string): any {
  return webdav().getDirectoryContents(`${userId}/${removeFirstSlash(path)}`, { details: true });
}

export function getAllContents(userId: string): any {
  return webdav().getDirectoryContents(`${removeFirstSlash(userId)}/private`, { deep: true });
}

export async function listLibraryDirectories(userId: string | number, path?: string): Promise<any> {
  const directories = await listDirectories(userId, path);
  if (!directories?.data) return false;

  const items: Array<FileStat> = directories.data
    .filter((item: FileStat) => item.basename[0] !== ".")
    .map((item: FileStat) => {
      const newItem = item;
      const filename = removeCornerSlash(item.filename.replace(/^.+?(\/|$)/, ""));
      if (item.type === "directory" && removeCornerSlash(filename) === getTalkPath()) {
        newItem.basename = "shared with me";
      }

      return newItem;
    });
  const isRoot = path === "/" || path === "";

  if (isRoot) {
    return items.filter((item: FileStat) => {
      if (item.type !== "directory") return false;

      return true;
    });
  }

  /*
  Adiciona panals que está dentro de talk na raiz
  if (directories) {
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < directories.data.length; index++) {
      const item: FileStat = directories.data[index];
      if (isRoot && item.basename.toLocaleLowerCase() === "talk") {
        // eslint-disable-next-line no-await-in-loop
        const talkItems = await listDirectories(userId, `${removeCornerSlash(path)}/Talk`);
        if (talkItems?.data) {
          items.join(talkItems.data);
        }
      } else {
        items.push(item);
      }
    }
  } */

  return items;
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
