import { removeFirstSlash } from "./utils";

const PRIVATE_PATH = "Private";
const OFFLINE_PATH = "Private/Offline";

export function getPrivatePath(): string {
  return PRIVATE_PATH;
}

export function getRootPath(): string {
  return PRIVATE_PATH;
}

export function getOfflinePath(): string {
  return OFFLINE_PATH;
}

export function exclusiveLocalPaths(): Array<string> {
  return [getOfflinePath()];
}

export function hasExclusiveLocalPath(path: string): boolean {
  if (exclusiveLocalPaths().includes(removeFirstSlash(path))) {
    return true;
  }

  return false;
}

export function handleDirectoryName(name: string) {
  return name.replace(/[^\w-]*/g, "");
}

export function getPathName(path: string): string {
  return path.replace(/.+?\/(.*)$/, "$1");
}
