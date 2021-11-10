import { removeCornerSlash, removeFirstSlash } from "./utils";

const PRIVATE_PATH = "private";
const PUBLIC_PATH = "public";
const OFFLINE_PATH = "offline";

export function getPrivatePath(): string {
  return PRIVATE_PATH;
}

export function getPublicPath(): string {
  return PUBLIC_PATH;
}

export function getRootPath(): string {
  return PRIVATE_PATH;
}

export function getOfflinePath(): string {
  return OFFLINE_PATH;
}

export function localPaths(): Array<string> {
  return [getOfflinePath()];
}

export function hasLocalPath(path: string | undefined | null): boolean {
  if (localPaths().includes(removeFirstSlash(path))) {
    return true;
  }

  return false;
}

export function exclusivePaths(): Array<string> {
  return [getOfflinePath(), getPrivatePath(), getPublicPath()];
}

export function hasExclusivePath(path: string | undefined | null): boolean {
  if (exclusivePaths().includes(removeFirstSlash(path))) {
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

export function hasRootPath(path: string | undefined | null): boolean {
  return path === "/" || path === "";
}
