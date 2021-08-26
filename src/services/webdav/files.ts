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
  // TODO try cath em todas as funções
  // TODO 404
  // TODO 409 conflict
}

export function putFile(userId: string | number, filePath: string, data: string) {
  try {
    webdav().putFileContents(`${userId}/${filePath}`, `${data}`);
  } catch (error) {
    if (error) {
      return false;
    }
  }
  return true;
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
