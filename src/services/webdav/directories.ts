import webdav from "@/services/webdav";
import { removeCornerSlash, removeFirstSlash } from "@/utils/utils";
import { FileStat } from "webdav";
import davAxiosConnection from "@/services/webdav/axiosConnection";

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

export async function listDirectoriesWithTags(path: string) {
  const body = `<?xml version="1.0" encoding="utf-8" ?>
                <d:propfind  xmlns:a="DAV:
                  xmlns:oc="http://owncloud.org/ns"
                  xmlns:nc="http://nextcloud.org/ns"
                  xmlns:ocs="http://open-collaboration-services.org/ns">
                  <d:prop>
                    <d:getlastmodified />
                    <d:getetag />
                    <d:getcontenttype />
                    <d:resourcetype />
                    <oc:fileid />
                    <oc:permissions />
                    <oc:size />
                    <d:getcontentlength />
                    <nc:has-preview />
                    <nc:mount-type />
                    <nc:is-encrypted />
                    <ocs:share-permissions />
                    <oc:tags />
                    <oc:display-name/>
                    <oc:user-visible/>
                    <oc:user-assignable/>
                    <oc:id/>
                    <oc:favorite />
                    <oc:comments-unread />
                    <oc:owner-id />
                    <oc:owner-display-name />
                    <oc:share-types />
                    <oc:created-at />
                    <oc:customtitle />
                    <oc:description />
                    <oc:language />
                  </d:prop>
                </d:propfind>`;
  const result = await davAxiosConnection(
    body,
    `dav/files/${removeCornerSlash(path)}`,
    undefined,
    undefined,
    true,
  );
  if (result.multistatus.response) {
    const items: any[] = [];
    result.multistatus.response.forEach((item: any) => {
      items.push(item.propstat.prop);
    });

    return items;
  }

  return false;
}
