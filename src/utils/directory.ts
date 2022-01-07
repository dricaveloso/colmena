import { removeFirstSlash, removeCornerSlash, trailingSlash } from "./utils";

const PRIVATE_PATH = "private";
const PUBLIC_PATH = "public";
const AUDIO_PATH = "private/audios";

export function getPrivatePath(): string {
  return PRIVATE_PATH;
}

export function getPublicPath(): string {
  return PUBLIC_PATH;
}

export function getRootPath(): string {
  return PRIVATE_PATH;
}

export function getAudioPath(): string {
  return AUDIO_PATH;
}

export function localPaths(): Array<string> {
  return [getAudioPath()];
}

export function isPanal(path: string): boolean {
  const pathSplited = removeFirstSlash(path).split("/");
  const initialFolder = pathSplited[0];
  const ignorePaths = [PRIVATE_PATH, PUBLIC_PATH];

  return !ignorePaths.includes(initialFolder);
}

export function hasLocalPath(path: string | undefined | null): boolean {
  if (localPaths().includes(removeFirstSlash(path))) {
    return true;
  }

  return false;
}

export function exclusivePaths(): Array<string> {
  return [getAudioPath(), getPrivatePath(), getPublicPath()];
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
  return name.replace(/[^\w\-\s]*/g, "");
}

export function getPathName(path: string): string {
  return path.replace(/.+?\/(.*)$/g, "$1");
}

export function getFilename(path: string): string {
  return path.replace(/.*\/(.+?\..+?)$/, "$1");
}

export function getPath(path: string): string {
  return path.replace(/(.*)\/.+?\..+?$/, "$1");
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

export function convertPrivateToUsername(path: string, username: string): string {
  const regex = new RegExp(`^${trailingSlash(getPrivatePath())}`);

  return removeCornerSlash(trailingSlash(path).replace(regex, trailingSlash(username)));
}

export function convertUsernameToPrivate(path: string, username: string): string {
  const regex = new RegExp(`^${trailingSlash(username)}`);

  return removeCornerSlash(trailingSlash(path).replace(regex, trailingSlash(getPrivatePath())));
}
