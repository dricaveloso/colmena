import { removeFirstSlash, removeCornerSlash, trailingSlash } from "./utils";

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
  return name.replace(/[^\w\-\s]*/g, "");
}

export function handleFileName(name: string) {
  return name.replace(/[^\w.\-\s]*/g, "");
}

export function getPathName(path: string): string {
  return path.replace(/.+?\/(.*)$/, "$1");
}

export function isRootPath(path: string | undefined | null): boolean {
  return path === "/" || path === "";
}

export function pathIsInFilename(path: string, filename: string | undefined): boolean {
  if (!filename) {
    return false;
  }

  const handledPath = trailingSlash(path).replace(/\/.+?\..*$/, "");
  const handledFilename = trailingSlash(filename).replace(/\/.+?\..*$/, "");

  const regex = new RegExp(`^${removeFirstSlash(handledPath)}.*`, "g");

  return removeFirstSlash(handledFilename).replace(regex, "") === "";
}

export function removeInitialPath(fullPath: string, initialPath: string): string {
  const regex = new RegExp(`^${removeCornerSlash(initialPath)}`, "g");

  return removeCornerSlash(fullPath).replace(regex, "");
}
