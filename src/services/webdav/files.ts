import webdav from "@/services/webdav";
import { BufferLike, ResponseDataDetailed } from "webdav";
// ver se não tem 404
export function listFile(
  userId: string | number,
  filePath: string,
): Promise<BufferLike | string | ResponseDataDetailed<BufferLike | string>> {
  return webdav().getFileContents(`${userId}/${filePath}`);
}
export function moveFile(userId: string | number, filename: string, destination: string) {
  try {
    webdav().moveFile(`${userId}/${filename}`, `${userId}/${destination}`);
  } catch (error) {
    if (error) {
      return false;
    }
  }
  return true;
  // TODO tratar 403
}
export function copyFile(userId: string | number, filename: string, destination: string) {
  webdav().copyFile(`${userId}/${filename}`, `${userId}/${destination}`);
}
export function putFile(userId: string | number, filePath: string) {
  try {
    webdav().getFileUploadLink(`${userId}/${filePath}`);
  } catch (error) {
    if (error) {
      return false;
    }
  }
  return true;
}

export function listImages(userId: string | number, filename: string) {
  console.log(filename);
  return webdav().getDirectoryContents(`${userId}/`, {
    deep: true,
    glob: "/**/*.{png,jpg,gif,jpeg}",
  });
}
export function deleteFile(userId: string | number, filename: string): boolean {
  try {
    webdav().deleteFile(`${userId}/${filename}`);
  } catch (error) {
    if (error) {
      return false;
    }
  }
  return true;
}
