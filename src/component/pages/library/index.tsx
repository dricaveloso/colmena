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
import { dateDescription, removeCornerSlash } from "@/utils/utils";
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
import { getFiles } from "@/services/webdav/files";

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
    padding: "2px 10px",
  },
}));

let currentItem: LibraryItemInterface | null = null;

function setCurrentItem(item: LibraryItemInterface) {
  currentItem = item;
}

export function getCurrentItem(): null | LibraryItemInterface {
  return currentItem;
}

export async function getWebDavDirectories(
  userId: string,
  currentDirectory: string,
  timeDescription: TimeDescriptionInterface,
) {
  const ncItems: false | LibraryItemInterface[] = await getFiles(
    userId,
    currentDirectory,
    timeDescription,
  );
  if (!ncItems) {
    return [];
  }

  ncItems.map((item: LibraryItemInterface) => {
    const { aliasFilename, filename } = item;
    if (filename === "") {
      currentItem = null;
    } else if (
      filename === removeCornerSlash(currentDirectory) ||
      aliasFilename === removeCornerSlash(currentDirectory)
    ) {
      setCurrentItem(item);
    } else if (filename === getPrivatePath()) {
      // eslint-disable-next-line no-param-reassign
      item.basename = userId;
    }

    return item;
  });

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
        mime: "audio/webm",
        arrayBufferBlob: file.arrayBufferBlob,
      };

      items.push(item);
    });
  }

  return items;
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

export function orderItems(order: string, items: Array<LibraryItemInterface>) {
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
) {
  const realPath = convertUsernameToPrivate(path, userId);
  const localItems = await getLocalFiles(userId, realPath, timeDescription);
  const remoteItems = await getWebDavDirectories(userId, realPath, timeDescription);
  const items = [...localItems, ...remoteItems];
  const deleteItems: Array<string> = [];

  let mountedItems = items.map((item: LibraryItemInterface) => {
    let updatedItem = item;
    if (item.environment === EnvironmentEnum.LOCAL && item.type === "file") {
      const remoteItem = remoteItems.find(
        (remoteItem) => item.aliasFilename === remoteItem.aliasFilename,
      );

      if (remoteItem) {
        updatedItem = { ...remoteItem, ...item };
        updatedItem.environment = EnvironmentEnum.BOTH;
        deleteItems.push(remoteItem.id);
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

export default function Library({
  items = [],
  listType = ListTypeEnum.LIST,
  isLoading = false,
  isDisabled = false,
  options,
  bottomOptions,
  handleItemClick,
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
        {isLoading && <DirectoryList quantity={4} />}
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
