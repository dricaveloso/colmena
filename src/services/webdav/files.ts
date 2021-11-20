import webdav from "@/services/webdav";
import { BufferLike, ResponseDataDetailed } from "webdav";
import { removeFirstSlash, getRandomInt, trailingSlash } from "@/utils/utils";
import { arrayBufferToBlob, createObjectURL } from "blob-util";

// ver se não tem 404
export function listFile(
  userId: string | number,
  filePath: string | null | undefined,
): Promise<BufferLike | string | ResponseDataDetailed<BufferLike | string>> {
  return webdav().getFileContents(`${userId}/${removeFirstSlash(filePath)}`);
}

export async function existFile(userId: string | number, remotePath: string): Promise<boolean> {
  try {
    await listFile(userId, removeFirstSlash(remotePath));
  } catch (err) {
    return false;
  }

  return true;
}

export async function getUniqueName(
  userId: string | number,
  path: string,
  name: string,
  count = 0,
): Promise<string> {
  let uniqueName: string = name;
  if (count > 0) {
    uniqueName = getRandomInt(1, 9999) + name;
  }

  const remotePath = `${trailingSlash(path)}${uniqueName}`;
  const exists = await existFile(userId, remotePath);
  if (exists) {
    return getUniqueName(userId, path, name, count + 1);
  }

  return uniqueName;
}

export async function moveFile(
  userId: string | number,
  filename: string,
  destination: string,
): Promise<boolean> {
  try {
    await webdav().moveFile(`${userId}/${filename}`, `${userId}/${destination}`);
  } catch (error) {
    if (error) {
      return Promise.resolve(false);
    }
  }

  return Promise.resolve(true);
}

export async function copyFile(userId: string | number, filename: string, destination: string) {
  try {
    await webdav().copyFile(`${userId}/${filename}`, `${userId}/${destination}`);
  } catch (error) {
    if (error) {
      return Promise.resolve(false);
    }
  }

  return Promise.resolve(true);
}

export async function putFile(
  userId: string | number,
  filePath: string,
  data: string | ArrayBuffer,
): Promise<boolean> {
  return webdav().putFileContents(`${userId}/${filePath}`, data, {
    overwrite: true,
    contentLength: false,
  });
}

export function listImages(userId: string | number, filename: string) {
  console.log(filename);
  return webdav().getDirectoryContents(`${userId}/`, {
    deep: true,
    glob: "/**/*.{png,jpg,gif,jpeg}",
  });
}

export async function deleteFile(userId: string | number, filename: string): Promise<boolean> {
  try {
    await webdav().deleteFile(`${userId}/${filename}`);
  } catch (error) {
    if (error) {
      return false;
    }
  }

  return true;
}

export async function downloadLink(
  userId: string | number,
  filename: string,
): Promise<string | boolean> {
  try {
    const content: any = await webdav().getFileContents(`${userId}/${filename}`, {
      details: true,
    });
    const mime = content?.headers["content-type"].replace(/;.*$/, "");
    const blobFile: Blob = arrayBufferToBlob(content.data, mime);
    return createObjectURL(blobFile);
  } catch (error) {
    console.log(error);
    return false;
  }
}
