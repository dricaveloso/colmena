import React, { useMemo, useEffect } from "react";
import ListItem from "@material-ui/core/ListItem";
import { v4 as uuid } from "uuid";
import List from "@material-ui/core/List";
import CardItem from "./CardItem";
import {
  LibraryInterface,
  LibraryItemInterface,
  TimeDescriptionInterface,
} from "@/interfaces/index";
import { getFilesByPath } from "@/store/idb/models/files";
import { makeStyles } from "@material-ui/core";
import { dateDescription, formatBytes } from "@/utils/utils";
import { EnvironmentEnum, OrderEnum, FilterEnum, ListTypeEnum } from "@/enums/index";
import {
  getPrivatePath,
  getPublicPath,
  convertUsernameToPrivate,
  getFilename,
  getTalkPath,
} from "@/utils/directory";
import DirectoryList from "@/components/ui/skeleton/DirectoryList";
import { setCurrentAudioPlaying } from "@/store/actions/library";
import { getFiles, getCurrentFile } from "@/services/webdav/files";
import { TFunction } from "next-i18next";

const useStyles = makeStyles(() => ({
  list: {
    textAlign: "left",
    alignItems: "stretch",
    width: "100%",
  },
  gridList: {
    width: "50%",
    display: "inline-flex",
    padding: 4,
  },
  verticalList: {
    padding: "2px 0px",
  },
}));

export function getCurrentItem(): null | LibraryItemInterface {
  return getCurrentFile();
}

export async function getWebDavDirectories(
  userId: string,
  currentDirectory: string,
  timeDescription: TimeDescriptionInterface,
  libraryTranslation: TFunction,
) {
  const ncItems: false | LibraryItemInterface[] = await getFiles(
    userId,
    currentDirectory,
    timeDescription,
    libraryTranslation,
  );
  if (!ncItems) {
    return [];
  }

  return ncItems;
}

export async function getLocalFiles(
  userId: string,
  currentDirectory: string,
  timeDescription: TimeDescriptionInterface,
) {
  const items: LibraryItemInterface[] = [];
  const localFiles = await getFilesByPath(userId, currentDirectory);
  if (localFiles.length > 0) {
    localFiles.forEach((file: any) => {
      const item = applyLocalItemInterface(file, timeDescription);

      items.push(item);
    });
  }

  return items;
}

export function applyLocalItemInterface(file: any, timeDescription: TimeDescriptionInterface) {
  const item: LibraryItemInterface = {
    filename: file.filename,
    basename: getFilename(file.filename),
    aliasFilename: file.aliasFilename,
    id: file.id,
    type: "file",
    environment: EnvironmentEnum.LOCAL,
    createdAt: file.createdAt,
    createdAtDescription: dateDescription(file.createdAt, timeDescription),
    updatedAt: file.createdAt,
    updatedAtDescription: dateDescription(file.createdAt, timeDescription),
    size: file?.size,
    sizeFormatted: file?.size ? formatBytes(file.size) : undefined,
    mime: file?.type,
    arrayBufferBlob: file.arrayBufferBlob,
    ownerId: file?.userId,
    ownerName: file?.userId,
    fileId: file?.nextcloudId,
    language: file?.language,
    tags: [],
    title: decodeURI(file?.title) || undefined,
    description: decodeURI(file?.description) || undefined,
  };

  return item;
}

export function filterItems(filter: string, items: Array<LibraryItemInterface>) {
  if (items.length === 0 || filter === "") {
    return items;
  }

  const audioExtensions: Array<string> = ["mp3", "ogg", "wav", "opus", "weba"];
  const textExtensions: Array<string> = ["md", "txt", "pdf"];
  const imageExtensions: Array<string> = ["jpg", "png", "gif", "jpeg"];

  return items.filter((item: LibraryItemInterface) => {
    const extension = item.extension === undefined ? "" : item.extension.toLowerCase();

    switch (filter) {
      case FilterEnum.OFFLINE:
        return item.environment === EnvironmentEnum.LOCAL;
      case FilterEnum.SYNC:
        return item.environment === EnvironmentEnum.REMOTE;
      case FilterEnum.AUDIO:
        return item.type === "audio" || audioExtensions.includes(extension);
      case FilterEnum.IMAGE:
        return imageExtensions.includes(extension);
      case FilterEnum.TEXT:
        return textExtensions.includes(extension);
      default:
        return true;
    }
  });
}

export function orderItems(order: OrderEnum | string, items: Array<LibraryItemInterface>) {
  if (items.length === 0 || order === "") {
    return items;
  }

  items.sort((a, b) => {
    switch (order) {
      case OrderEnum.OLDEST_FIST:
        return a.updatedAt !== undefined && b.updatedAt !== undefined && a.updatedAt > b.updatedAt
          ? 1
          : -1;
      case OrderEnum.HIGHLIGHT:
      case OrderEnum.LATEST_FIRST:
        return a.updatedAt !== undefined && b.updatedAt !== undefined && a.updatedAt < b.updatedAt
          ? 1
          : -1;
      case OrderEnum.ASC_ALPHABETICAL:
        return a.basename !== undefined &&
          b.basename !== undefined &&
          a.basename.toLowerCase() > b.basename.toLowerCase()
          ? 1
          : -1;
      case OrderEnum.DESC_ALPHABETICAL:
        return a.basename !== undefined &&
          b.basename !== undefined &&
          a.basename.toLowerCase() < b.basename.toLowerCase()
          ? 1
          : -1;
      default:
        return 0;
    }
  });

  if (order === OrderEnum.HIGHLIGHT) {
    items.sort((a, b) => {
      if (b.filename === getPrivatePath()) {
        return 1;
      }

      if (b.filename === getTalkPath()) {
        return 1;
      }

      if (b.filename === getPublicPath()) {
        return 1;
      }

      return -1;
    });
  }

  return items;
}

export async function getItems(
  path: string,
  userId: string,
  timeDescription: TimeDescriptionInterface,
  libraryTranslation: TFunction,
) {
  const realPath = convertUsernameToPrivate(path, userId);
  const localItems = await getLocalFiles(userId, realPath, timeDescription);
  const remoteItems = await getWebDavDirectories(
    userId,
    realPath,
    timeDescription,
    libraryTranslation,
  );
  const items = [...localItems, ...remoteItems];
  const deleteItems: Array<string> = [];

  let mountedItems = items.map((item: LibraryItemInterface) => {
    let updatedItem = item;
    if (item.environment === EnvironmentEnum.LOCAL && item.type === "file") {
      const remoteItem = remoteItems.find((remoteItem) => item.filename === remoteItem.filename);

      if (remoteItem) {
        const mergeItems = mergeEnvItems(item, remoteItem);
        if (mergeItems) {
          updatedItem = mergeItems;
          deleteItems.push(remoteItem.id);
        }
      }
    }

    return updatedItem;
  });

  if (deleteItems.length > 0) {
    mountedItems = mountedItems.filter(
      (item: LibraryItemInterface) =>
        !deleteItems.some(
          (itemId) => item.environment === EnvironmentEnum.REMOTE && item.id === itemId,
        ),
    );
  }

  return mountedItems;
}

export function mergeEnvItems(
  localItem: LibraryItemInterface | null,
  remoteItem: LibraryItemInterface | null,
) {
  if (localItem && remoteItem) {
    return {
      ...localItem,
      ...remoteItem,
      id: localItem.id,
      environment: EnvironmentEnum.BOTH,
    };
  }

  if (localItem) {
    return localItem;
  }

  if (remoteItem) {
    return remoteItem;
  }

  return false;
}

export default function Library({
  items = [],
  listType = ListTypeEnum.LIST,
  isLoading = false,
  isDisabled = false,
  options,
  bottomOptions,
  handleItemClick,
  itemsQuantitySkeleton = 4,
}: LibraryInterface) {
  const classes = useStyles();

  useEffect(() => {
    setCurrentAudioPlaying("");
  }, []);

  const isVerticalList = useMemo(() => listType === ListTypeEnum.LIST, [listType]);
  const orientation = isVerticalList ? "vertical" : "horizontal";

  return (
    <>
      <List className={classes.list}>
        {isLoading && <DirectoryList quantity={itemsQuantitySkeleton} />}
        {!isLoading &&
          items.length > 0 &&
          items.map((item: LibraryItemInterface) => (
            <ListItem
              key={uuid()}
              disableGutters
              className={isVerticalList ? classes.verticalList : classes.gridList}
            >
              <CardItem
                {...item}
                handleOpenCard={handleItemClick}
                isDisabled={isDisabled}
                orientation={orientation}
                options={options}
                bottomOptions={bottomOptions}
              />
            </ListItem>
          ))}
      </List>
    </>
  );
}
