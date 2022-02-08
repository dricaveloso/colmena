/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/ban-types */
import webdav from "@/services/webdav";
import {
  BufferLike,
  ResponseDataDetailed,
  DAVResultResponseProps,
  DAVResult,
  DAVResultResponse,
} from "webdav";
import {
  removeFirstSlash,
  getRandomInt,
  trailingSlash,
  removeCornerSlash,
  getExtensionFilename,
  dateDescription,
  fileSizeConvert,
} from "@/utils/utils";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { arrayBufferToBlob, blobToArrayBuffer, createObjectURL } from "blob-util";
import davAxiosConnection from "@/services/webdav/axiosConnection";
import axiosBase from "@/services/webdav/axiosBase";
import getConfig from "next/config";
import { LibraryItemInterface, TimeDescriptionInterface } from "@/interfaces/index";
import { convertPrivateToUsername, getPrivatePath, getTalkPath } from "@/utils/directory";
import { EnvironmentEnum } from "@/enums/*";
import { TFunction } from "next-i18next";

const { publicRuntimeConfig } = getConfig();

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

export async function blobFile(userId: string | number, filename: string): Promise<Blob | boolean> {
  try {
    const content: any = await webdav().getFileContents(`${userId}/${filename}`, {
      details: true,
    });
    const mime = content?.headers["content-type"].replace(/;.*$/, "");
    return arrayBufferToBlob(content.data, mime);
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getFileContents(
  userId: string | number,
  filename: string,
): Promise<string | BufferLike | ResponseDataDetailed<string | BufferLike>> {
  return webdav().getFileContents(`${userId}/${filename}`, {
    details: true,
  });
}

/*
export async function downloadLink(userId: string | number, filename: string) {
  return webdav().getFileDownloadLink(`${userId}/${filename}`);
} */

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

const payloadRequest = `<?xml version="1.0" encoding="utf-8" ?>
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
    <oc:customtitle />
    <oc:customdescription />
    <oc:description />
    <oc:language />

  </d:prop>
</d:propfind>`;

export async function getDataFile(
  userId: string,
  path: string,
  timeDescription: TimeDescriptionInterface,
) {
  const result = await davAxiosConnection(
    payloadRequest,
    `files/${removeCornerSlash(path)}`,
    undefined,
    undefined,
    true,
  );

  if (typeof result.multistatus.response[0].propstat.prop === "object") {
    return itemPayload(userId, result.multistatus.response[0], timeDescription);
  }

  return false;
}

export async function getFiles(
  userId: string,
  path: string,
  timeDescription: TimeDescriptionInterface,
  libraryTranslation: TFunction,
) {
  const ncFiles = await davAxiosConnection(
    payloadRequest,
    `files/${removeCornerSlash(path)}`,
    undefined,
    undefined,
    true,
  );
  if (!ncFiles) {
    return false;
  }

  const files = ncFiles as DAVResult;

  const items: Array<LibraryItemInterface> = [];
  files.multistatus.response.forEach((item) => {
    items.push(itemPayload(userId, item, timeDescription));
  });

  return handleItems(userId, items, path, libraryTranslation);
}

const itemPayload = (
  userId: string,
  item: DAVResultResponse,
  timeDescription: TimeDescriptionInterface,
) => {
  const filename = decodeURI(removeCornerSlash(item.href.replace(/^.+?\/.+?(\/|$)/, "")));
  const basename = removeCornerSlash(filename.replace(/^.*\/(.*)$/, "$1"));
  const aliasFilename = convertPrivateToUsername(filename, userId);
  const prop = item.propstat.prop as DAVResultResponseProps | any;
  const type = !prop?.getcontenttype ? "directory" : "file";
  const lastModified = prop?.getlastmodified;
  let updatedAt;
  if (lastModified) {
    updatedAt = new Date(lastModified);
  }

  const dateCreatedAt = typeof prop["created-at"] !== "undefined" ? prop["created-at"] : null;
  let createdAt;
  if (dateCreatedAt) {
    createdAt = new Date(dateCreatedAt);
  }

  const newItem: LibraryItemInterface = {
    basename,
    id: filename,
    filename,
    aliasFilename,
    type,
    environment: EnvironmentEnum.REMOTE,
    extension: getExtensionFilename(filename),
    createdAt,
    createdAtDescription: dateDescription(createdAt, timeDescription),
    updatedAt,
    updatedAtDescription: dateDescription(updatedAt, timeDescription),
    mime: prop?.getcontenttype,
    size: prop?.size,
    sizeFormatted: `${fileSizeConvert(prop.size).description}`,
    contentLength: prop?.getcontentlength,
    fileId: prop?.fileid,
    nextcloudId: prop?.id,
    eTag: prop?.getetag,
    favorite: prop?.favorite,
    commentsUnread: typeof prop["comments-unread"] !== "undefined" ? prop["comments-unread"] : null,
    ownerId: typeof prop["owner-id"] !== "undefined" ? prop["owner-id"] : null,
    ownerName:
      typeof prop["owner-display-name"] !== "undefined" ? prop["owner-display-name"] : null,
    title: prop?.customtitle,
    description: prop?.customdescription,
    language: prop?.language,
  };

  return newItem;
};

let currentItem: LibraryItemInterface | null = null;

function setCurrentFile(item: null | LibraryItemInterface) {
  currentItem = item;
}

export function getCurrentFile(): null | LibraryItemInterface {
  return currentItem;
}

const handleItems = (
  userId: string,
  items: Array<LibraryItemInterface>,
  path: string,
  libraryTranslation: TFunction,
) => {
  const handledItems = items
    .map((item: LibraryItemInterface) => {
      const newItem = item;
      const { type, filename } = newItem;
      if (type === "directory" && removeCornerSlash(filename) === getTalkPath()) {
        newItem.basename = libraryTranslation("talkFolderName");
      }

      if (filename === "") {
        setCurrentFile(null);
      } else if (filename === removeCornerSlash(path)) {
        setCurrentFile(item);
      } else if (filename === getPrivatePath()) {
        newItem.basename = userId;
      }

      return newItem;
    })
    .filter(
      (item: LibraryItemInterface, index) =>
        index > 0 && item.basename !== "" && item.basename[0] !== ".",
    );

  const isRoot = path === "/" || path === "";
  if (isRoot) {
    return handledItems.filter(({ type }: LibraryItemInterface) => type === "directory");
  }

  return handledItems;
};

interface FileDataNCInterface {
  customtitle?: string;
  description?: string;
  customdescription?: string;
  language: string;
}

type CustomFieldsFileDataProps = "customtitle" | "customdescription" | "description" | "language";

export async function setDataFile(data: FileDataNCInterface, path: string) {
  let body = `<?xml version="1.0" encoding="utf-8" ?>
  <d:propertyupdate xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
    <d:set>
        <d:prop>`;

  Object.keys(data).forEach((item: CustomFieldsFileDataProps) => {
    body += `<oc:${item}>${encodeURIComponent(String(data[item]))}</oc:${item}>`;
  });

  body += `<oc:created-at>${new Date().toISOString()}</oc:created-at></d:prop>
    </d:set>
  </d:propertyupdate>`;

  const result = await davAxiosConnection(
    body,
    `files/${removeCornerSlash(path)}`,
    "PROPPATCH",
    { "Content-Type": "application/xml; charset=utf-8" },
    true,
  );
  if (typeof result.multistatus.response[0].propstat.prop === "object") {
    return result.multistatus.response[0].propstat.prop;
  }

  return false;
}

let cancelUpload = false;

export function abortUpload() {
  cancelUpload = true;
}

export async function chunkFileUpload(userId: string | number, file: File, filename: string) {
  const maxChunkFile = 2 * 1000000; // 2mb
  const totalLength = file.size;

  /* if (maxChunkFile >= totalLength) {
    const contentFile = await blobToArrayBuffer(file);

    return putFile(userId, filename, contentFile);
  } */

  let tempFilename = "file";
  // eslint-disable-next-line no-plusplus
  for (let count = 1; count < 4; count++) {
    tempFilename += `-${getRandomInt(1000, 9999)}`;
  }

  const created = await createBaseFileUpload(userId, tempFilename);
  if (created.status !== 201) {
    return false;
  }

  let initialChunk = 0;
  let finalChunk = 0;
  let done = false;
  let chunkNumber = 0;
  while (done === false) {
    if (cancelUpload) {
      abortChunkFileUpload(userId, tempFilename);

      return false;
    }

    chunkNumber += 1;
    if (chunkNumber > 1) {
      initialChunk += maxChunkFile;
    }

    finalChunk = initialChunk + maxChunkFile;
    if (finalChunk > totalLength) {
      finalChunk = totalLength;
    }

    // eslint-disable-next-line no-await-in-loop
    const chunkContent = await file.slice(initialChunk, finalChunk, file.type).arrayBuffer();
    // console.log(initialChunk, finalChunk, totalLength, chunkNumber, chunkContent);
    const positionPath = `${(initialChunk + 1).toString().padStart(15, "0")}-${finalChunk
      .toString()
      .padStart(15, "0")}`;

    // eslint-disable-next-line no-await-in-loop
    await sendChunkFile(userId, tempFilename, positionPath, chunkContent);

    if (finalChunk >= totalLength) done = true;
  }

  await doneChunkFileUpload(userId, tempFilename, filename);

  return true;
}

async function createBaseFileUpload(userId: string | number, tempFilename: string) {
  return axiosBase(null, `dav/uploads/${userId}/${tempFilename}`, "MKCOL", {});
}

async function sendChunkFile(
  userId: string | number,
  tempFilename: string,
  position: string,
  content: ArrayBuffer,
) {
  return axiosBase(content, `dav/uploads/${userId}/${tempFilename}/${position}`, "PUT", {
    "Content-Type": "application/octet-stream",
  });
}

async function doneChunkFileUpload(
  userId: string | number,
  tempFilename: string,
  destination: string,
) {
  return axiosBase(null, `dav/uploads/${userId}/${tempFilename}/.file`, "MOVE", {
    Destination: `${publicRuntimeConfig.api.baseUrl}/remote.php/dav/files/${userId}/${destination}`,
    "Content-Type": null,
  });
}

async function abortChunkFileUpload(userId: string | number, tempFilename: string) {
  return axiosBase(null, `dav/uploads/${userId}/${tempFilename}/`, "DELETE", {
    "Content-Type": null,
  });
}
