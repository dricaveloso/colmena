import React, { useMemo } from "react";
import ListItem from "@material-ui/core/ListItem";
import { v4 as uuid } from "uuid";
import List from "@material-ui/core/List";
import CardItem from "./CardItem";
import {
  LibraryInterface,
  LibraryItemInterface,
  TimeDescriptionInterface,
} from "@/interfaces/index";
import { listLibraryDirectories } from "@/services/webdav/directories";
import { FileStat } from "webdav";
import { getFilesByPath } from "@/store/idb/models/files";
import { makeStyles } from "@material-ui/core";
import { getExtensionFilename, dateDescription, removeCornerSlash } from "@/utils/utils";
import { EnvironmentEnum, OrderEnum, FilterEnum, ListTypeEnum } from "@/enums/index";
import {
  getAudioPath,
  getPrivatePath,
  getPublicPath,
  convertPrivateToUsername,
  convertUsernameToPrivate,
} from "@/utils/directory";
import DirectoryList from "@/components/ui/skeleton/DirectoryList";

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
    padding: 1,
  },
}));

export async function getWebDavDirectories(
  userId: string,
  currentDirectory: string,
  timeDescription: TimeDescriptionInterface,
) {
  const items: LibraryItemInterface[] = [];

  const nxDirectories = await listLibraryDirectories(
    userId,
    convertUsernameToPrivate(currentDirectory, userId),
  );

  if (nxDirectories?.data.length > 0) {
    nxDirectories.data.forEach((directory: FileStat) => {
      const filename = removeCornerSlash(directory.filename.replace(/^.+?(\/|$)/, ""));
      let { basename } = directory;
      const aliasFilename = convertPrivateToUsername(filename, userId);
      const date = new Date(directory.lastmod);
      if (
        filename !== "" &&
        filename !== removeCornerSlash(currentDirectory) &&
        aliasFilename !== removeCornerSlash(currentDirectory)
      ) {
        if (filename === getPrivatePath()) {
          basename = userId;
        }

        const item: LibraryItemInterface = {
          basename,
          id: directory.filename,
          filename,
          aliasFilename,
          type: directory.type,
          environment: EnvironmentEnum.REMOTE,
          extension: getExtensionFilename(filename),
          createdAt: date,
          createdAtDescription: dateDescription(date, timeDescription),
          mime: directory.mime,
          size: directory.size,
        };

        if (item.basename && item.basename[0] !== ".") {
          items.push(item);
        }
      }
    });
  }

  return items;
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
        filename: `${file.path}/${file.title}.opus`,
        basename: file.title ?? "",
        aliasFilename: `${file.path}/${file.title}.opus`,
        id: file.id,
        type: "file",
        environment: EnvironmentEnum.LOCAL,
        createdAt: file.createdAt,
        createdAtDescription: dateDescription(file.createdAt, timeDescription),
        mime: "audio/webm",
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

  const audioExtensions: Array<string> = ["mp3", "ogg", "wav"];
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
        return a.createdAt !== undefined && b.createdAt !== undefined && a.createdAt > b.createdAt
          ? 1
          : -1;
      case OrderEnum.HIGHLIGHT:
      case OrderEnum.LATEST_FIRST:
        return a.createdAt !== undefined && b.createdAt !== undefined && a.createdAt < b.createdAt
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
      if (b.filename === getAudioPath()) {
        return 1;
      }

      if (b.filename === getPrivatePath()) {
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
  const localItems = await getLocalFiles(userId, path, timeDescription);
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
