/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/ban-types */
import webdav from "@/services/webdav";
import { BufferLike, ResponseDataDetailed, DAVResultResponseProps } from "webdav";
import { removeFirstSlash, getRandomInt, trailingSlash, removeCornerSlash } from "@/utils/utils";
import { arrayBufferToBlob, createObjectURL } from "blob-util";
import davAxiosConnection from "@/services/webdav/axiosConnection";

interface DAVFileIdResultResponseProps extends DAVResultResponseProps {
  fileid?: number;
}

interface CustomCredentialsInterface {
  username: string;
  password: string;
}

// ver se não tem 404
export function listFile(
  userId: string | number,
  filePath: string | null | undefined,
  customCredentials: CustomCredentialsInterface | null = null,
  formatText = false,
): Promise<BufferLike | string | ResponseDataDetailed<BufferLike | string> | ArrayBuffer> {
  if (formatText)
    return webdav("files", customCredentials).getFileContents(
      `${userId}/${removeFirstSlash(filePath)}`,
      {
        format: "text",
      },
    );

  return webdav("files", customCredentials).getFileContents(
    `${userId}/${removeFirstSlash(filePath)}`,
  );
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
  customCredentials: CustomCredentialsInterface | null = null,
): Promise<boolean> {
  return webdav("files", customCredentials).putFileContents(`${userId}/${filePath}`, data, {
    overwrite: true,
    contentLength: false,
  });
}

export function listImages(userId: string | number) {
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

export async function getFileId(userId: string, path: string) {
  const body = `<?xml version="1.0" encoding="utf-8" ?>
                <a:propfind xmlns:a="DAV:" xmlns:oc="http://owncloud.org/ns">
                  <a:prop>
                    <oc:fileid/>
                  </a:prop>
                </a:propfind>`;
  const result = await davAxiosConnection(body, `files/${userId}/${removeCornerSlash(path)}`);
  if (typeof result.multistatus.response[0].propstat.prop === "object") {
    const { prop }: { prop: DAVFileIdResultResponseProps } =
      result.multistatus.response[0].propstat;
    return prop.fileid;
  }

  return false;
}

export async function getDataFile(path: string) {
  const body = `<?xml version="1.0" encoding="utf-8" ?>
                <d:propfind  xmlns:d="DAV:"
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
                    <oc:title />
                    <oc:description />
                    <oc:language />

                  </d:prop>
                </d:propfind>`;
  const result = await davAxiosConnection(
    body,
    `files/${removeCornerSlash(path)}`,
    undefined,
    undefined,
    true,
  );
  if (typeof result.multistatus.response[0].propstat.prop === "object") {
    return result.multistatus.response[0].propstat.prop;
  }

  return false;
}

interface FileDataNCInterface {
  title: string;
  description?: string;
  language: string;
}

export async function setDataFile(data: FileDataNCInterface, path: string) {
  let body = `<?xml version="1.0"?>
  <d:propertyupdate xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
    <d:set>
        <d:prop>`;

  Object.keys(data).forEach((item: "title" | "description" | "language") => {
    body += `<oc:${item}>${data[item]}</oc:${item}>`;
  });

  body += `<oc:created-at>${new Date().toISOString()}</oc:created-at></d:prop>
    </d:set>
  </d:propertyupdate>`;

  const result = await davAxiosConnection(
    body,
    `files/${removeCornerSlash(path)}`,
    "PROPPATCH",
    { "Content-Type": "application/xml" },
    true,
  );
  if (typeof result.multistatus.response[0].propstat.prop === "object") {
    return result.multistatus.response[0].propstat.prop;
  }

  return false;
}
