/* eslint-disable no-await-in-loop */
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
  FileStat,
} from "webdav";
import {
  removeFirstSlash,
  getRandomInt,
  trailingSlash,
  removeCornerSlash,
  getExtensionFilename,
  dateDescription,
  formatBytes,
  decodeURI,
} from "@/utils/utils";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { arrayBufferToBlob, blobToArrayBuffer, createObjectURL } from "blob-util";
import davAxiosConnection from "@/services/webdav/axiosConnection";
import axiosBase from "@/services/webdav/axiosBase";
import getConfig from "next/config";
import { LibraryItemInterface, TimeDescriptionInterface } from "@/interfaces/index";
import {
  convertPrivateToUsername,
  getPrivatePath,
  getPublicPath,
  getTalkPath,
} from "@/utils/directory";
import { EnvironmentEnum } from "@/enums/*";
import { TFunction } from "next-i18next";
import constants from "@/constants/index";
import {
  getByTempfilename as getTransferByTempfilename,
  update as updateTransfer,
} from "@/store/idb/models/transfers";
import { createShare } from "@/services/share/share";
// eslint-disable-next-line import/no-cycle
import { findTokenChatByPath } from "@/pages/recording";

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
  const filename = decodeURIComponent(removeCornerSlash(item.href.replace(/^.+?\/.+?(\/|$)/, "")));
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
    createdAtDescription: createdAt ? dateDescription(createdAt, timeDescription) : null,
    updatedAt,
    updatedAtDescription: updatedAt ? dateDescription(updatedAt, timeDescription) : null,
    mime: prop?.getcontenttype,
    size: prop?.size,
    sizeFormatted: formatBytes(prop.size),
    contentLength: prop?.getcontentlength,
    fileId: prop?.fileid,
    nextcloudId: prop?.id,
    eTag: prop?.getetag,
    favorite: prop?.favorite,
    commentsUnread: typeof prop["comments-unread"] !== "undefined" ? prop["comments-unread"] : null,
    ownerId: typeof prop["owner-id"] !== "undefined" ? prop["owner-id"] : null,
    ownerName:
      typeof prop["owner-display-name"] !== "undefined" ? prop["owner-display-name"] : null,
    title: decodeURI(prop?.customtitle) || undefined,
    description: decodeURI(prop?.customdescription) || undefined,
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
      if (type === "directory") {
        switch (removeCornerSlash(filename)) {
          case getTalkPath():
            newItem.basename = libraryTranslation("talkFolderName");
            break;
          case getPublicPath():
            newItem.basename = libraryTranslation("publicFolderName");
            break;
          default:
            break;
        }
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
    .filter(({ basename, type, filename }: LibraryItemInterface, index) => {
      if (index === 0 || basename === "" || basename[0] === ".") {
        return false;
      }

      if (type === "directory" && removeCornerSlash(filename) === getPublicPath()) {
        return false;
      }

      return true;
    });

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

export async function getAllPaths(userId: string, timeDescription: TimeDescriptionInterface) {
  const paths = await webdav().getDirectoryContents(`${removeFirstSlash(userId)}`, {
    details: true,
    deep: true,
  });
  const results = paths as ResponseDataDetailed<Array<FileStat>>;
  const newItems: LibraryItemInterface[] = [];
  results.data.forEach((item) => {
    const filename = item.filename.replace(/^.+?\//, "");
    const updatedAt = new Date(item.lastmod);
    const newItem: LibraryItemInterface = {
      id: filename,
      basename: item.basename,
      filename,
      aliasFilename: convertPrivateToUsername(filename, userId),
      updatedAt,
      updatedAtDescription: dateDescription(updatedAt, timeDescription),
      mime: item.mime,
      size: item.size,
      sizeFormatted: item.size > 0 ? formatBytes(item.size) : undefined,
      type: item.type,
      environment: EnvironmentEnum.REMOTE,
    };

    newItems.push(newItem);
  });

  return newItems;
}

export async function searchItems(items: LibraryItemInterface[], keyword: string) {
  if (!items) {
    return [];
  }

  return Promise.resolve(
    items.filter(
      (item: LibraryItemInterface) =>
        item.basename.toString().toLowerCase().indexOf(keyword.toString().toLowerCase()) >= 0,
    ),
  );
}

// let cancelUpload = false;

export async function abortUpload(tempFilenameChunk: string) {
  const transfer = await getTransferByTempfilename(tempFilenameChunk);
  await updateTransfer(transfer.id, {
    status: "canceled",
    updatedAt: Date.now(),
  });
  // cancelUpload = true;
}

type TransferIDBProps = {
  id: number;
  file: File;
  currentChunk: number;
  status: "in progress" | "canceled" | "complete" | "pending";
  filename: string;
  chatNotify: boolean;
};

export async function chunkFileUpload(
  userId: string | number,
  tempFilename: string,
  filename: string,
  transfer: TransferIDBProps,
) {
  if (transfer.status === "complete" || transfer.status === "canceled") return;

  const fileUp = transfer.file;
  const maxChunkFile = constants.MAX_CHUNK_FILE;
  const totalLength = fileUp.size;

  let initialChunk = !transfer.currentChunk ? 0 : transfer.currentChunk;
  let finalChunk = !transfer.currentChunk ? 0 : transfer.currentChunk;
  let done = false;
  let chunkNumber = 0;
  let abort = false;
  while (done === false) {
    const transferCanceled = await getTransferByTempfilename(tempFilename);
    if (transferCanceled.status === "canceled") {
      await abortChunkFileUpload(userId, tempFilename);
      abort = true;
      break;
    }

    chunkNumber += 1;
    if (chunkNumber > 1) {
      initialChunk += maxChunkFile;
    }

    finalChunk = initialChunk + maxChunkFile;
    if (finalChunk > totalLength) {
      finalChunk = totalLength;
    }

    const chunkContent = await fileUp.slice(initialChunk, finalChunk, fileUp.type).arrayBuffer();
    const positionPath = `${(initialChunk + 1).toString().padStart(15, "0")}-${finalChunk
      .toString()
      .padStart(15, "0")}`;

    await sendChunkFile(userId, tempFilename, positionPath, chunkContent);
    await updateTransfer(transfer.id, {
      currentChunk: finalChunk,
      progress: Math.round((100 * finalChunk) / totalLength),
      updatedAt: Date.now(),
    });

    if (finalChunk >= totalLength) {
      await updateTransfer(transfer.id, {
        currentChunk: finalChunk,
        status: "complete",
        progress: 100,
        updatedAt: Date.now(),
        file: null,
      });
      done = true;
    }
  }

  if (!abort) {
    await doneChunkFileUpload(userId, tempFilename, filename);
    // document.dispatchEvent(new CustomEvent("finish-upload", { detail: { name: "Vinicius" } }));
    if (transfer.chatNotify) {
      const token = await findTokenChatByPath(filename);
      if (token && typeof token === "string") {
        await createShare(token, filename);
      }
    }
  }
}

export async function createBaseFileUpload(userId: string | number, tempFilename: string) {
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
