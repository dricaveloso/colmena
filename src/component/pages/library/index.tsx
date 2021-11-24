import React, { useMemo } from "react";
import ListItem from "@material-ui/core/ListItem";
import { v4 as uuid } from "uuid";
import List from "@material-ui/core/List";
import CardItem from "./CardItem";
import {
  LibraryInterface,
  LibraryItemInterface,
  RecordingInterface,
  TimeDescriptionInterface,
} from "@/interfaces/index";
import { listLibraryDirectories } from "@/services/webdav/directories";
import { FileStat } from "webdav";
import { getAllAudios } from "@/store/idb/models/audios";
import { makeStyles } from "@material-ui/core";
import { getExtensionFilename, dateDescription, removeCornerSlash } from "@/utils/utils";
import { EnvironmentEnum, OrderEnum, FilterEnum, ListTypeEnum } from "@/enums/index";
import {
  getOfflinePath,
  getPathName,
  getPrivatePath,
  getPublicPath,
  isRootPath,
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

  const nxDirectories = await listLibraryDirectories(userId, currentDirectory);
  if (nxDirectories?.data.length > 0) {
    nxDirectories.data.forEach((directory: FileStat) => {
      const filename = removeCornerSlash(directory.filename.replace(/^.+?(\/|$)/, ""));
      const date = new Date(directory.lastmod);
      if (filename !== "" && filename !== removeCornerSlash(currentDirectory)) {
        const item: LibraryItemInterface = {
          basename: directory.basename,
          id: directory.filename,
          filename,
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

export async function getLocalFiles(userId: string, timeDescription: TimeDescriptionInterface) {
  const items: LibraryItemInterface[] = [];
  const localFiles = await getAllAudios(userId);
  if (localFiles.length > 0) {
    localFiles.forEach((file: RecordingInterface) => {
      const item: LibraryItemInterface = {
        filename: file.title ?? "",
        basename: file.title ?? "",
        id: file.id,
        type: "audio",
        environment: EnvironmentEnum.LOCAL,
        extension: "ogg",
        createdAt: file.createdAt,
        createdAtDescription: dateDescription(file.createdAt, timeDescription),
        mime: "audio/ogg",
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
      if (b.filename === getOfflinePath()) {
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
  const offlinePath = getOfflinePath();
  if (path === offlinePath) {
    return getLocalFiles(userId, timeDescription);
  }

  const items = await getWebDavDirectories(userId, path, timeDescription);
  if (isRootPath(path)) {
    const item: LibraryItemInterface = {
      basename: getPathName(offlinePath),
      id: offlinePath,
      filename: offlinePath,
      type: "directory",
      environment: EnvironmentEnum.LOCAL,
    };

    items.push(item);
  }

  return items;
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
