/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import LayoutApp from "@/components/statefull/LayoutApp";
import { GetStaticProps } from "next";
import {
  I18nInterface,
  LibraryItemInterface,
  RecordingInterface,
  TimeDescriptionInterface,
} from "@/interfaces/index";
import { listLibraryDirectories } from "@/services/webdav/directories";
import { PropsUserSelector, PropsLibrarySelector } from "@/types/index";
import { useSelector, useDispatch } from "react-redux";
import { FileStat } from "webdav";
import { getAllAudios } from "@/store/idb/models/audios";
import FlexBox from "@/components/ui/FlexBox";
import { Box, Button } from "@material-ui/core";
import ItemList from "@/components/pages/library/ItemList";
import HeaderBar from "@/components/pages/library/HeaderBar";
import { useRouter } from "next/router";
import { getExtensionFilename, dateDescription } from "@/utils/utils";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import {
  EnvironmentEnum,
  JustifyContentEnum,
  ListTypeEnum,
  OrderEnum,
  FilterEnum,
} from "@/enums/index";
import { setLibraryFiles, setLibraryPathExists, setLibraryPath } from "@/store/actions/library";
import {
  getOfflinePath,
  getPathName,
  getPrivatePath,
  getPublicPath,
  isRootPath,
} from "@/utils/directory";
import DirectoryList from "@/components/ui/skeleton/DirectoryList";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["library"])),
  },
});

function MyLibrary() {
  const library = useSelector((state: { library: PropsLibrarySelector }) => state.library);
  const currentDirectory = library.currentPath;
  const rawItems: Array<LibraryItemInterface> = library.libraryFiles;
  const notFoundDir = !library.currentPathExists;
  const [isLoading, setIsLoading] = useState(false);
  const [listType, setListType] = useState(ListTypeEnum.LIST);
  const router = useRouter();
  const { libraryPath: path } = router.query;
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [items, setItems] = useState<Array<LibraryItemInterface>>(
    [] as Array<LibraryItemInterface>,
  );
  const [currentPath, setCurrentPath] = useState("");
  const [order, setOrder] = useState(OrderEnum.LATEST_FIRST);
  const [filter, setFilter] = useState("");
  const { t } = useTranslation("common");
  const { t: l } = useTranslation("library");
  const dispatch = useDispatch();
  const timeDescription: TimeDescriptionInterface = t("timeDescription", { returnObjects: true });

  const getWebDavDirectories = useCallback(
    async (userId: string, currentDirectory: string) => {
      const items: LibraryItemInterface[] = [];

      const nxDirectories = await listLibraryDirectories(userId, currentDirectory);
      console.log(nxDirectories);
      if (nxDirectories?.data.length > 0) {
        nxDirectories.data.forEach((directory: FileStat) => {
          const filename = directory.filename.replace(/^.+?(\/|$)/, "");
          const date = new Date(directory.lastmod);
          if (filename !== "" && filename !== currentDirectory) {
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

            items.push(item);
          }
        });
      }

      return items;
    },
    [timeDescription],
  );

  const getLocalFiles = useCallback(
    async (userId: string) => {
      const items: LibraryItemInterface[] = [];
      const localFiles = await getAllAudios(userId);
      if (localFiles.length > 0) {
        localFiles.forEach((file: RecordingInterface) => {
          const item: LibraryItemInterface = {
            basename: file.title,
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
    },
    [timeDescription],
  );

  const orderItems = useCallback((order: string, items: Array<LibraryItemInterface>) => {
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
  }, []);

  const filterItems = useCallback((filter: string, items: Array<LibraryItemInterface>) => {
    if (items.length === 0 || filter === "") {
      return items;
    }

    const audioExtensions: Array<string> = ["mp3", "ogg", "wav"];
    const textExtensions: Array<string> = ["md", "txt", "pdf"];
    const imageExtensions: Array<string> = ["jpg", "png", "gif", "jpeg"];

    return items.filter((item) => {
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
          return item;
      }
    });
  }, []);

  const getItems = async (path: string) => {
    const offlinePath = getOfflinePath();
    if (path === offlinePath) {
      return getLocalFiles(userRdx.user.id);
    }

    const items = await getWebDavDirectories(userRdx.user.id, path);
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
  };

  useEffect(() => {
    let currentPath = "/";
    if (typeof path === "object") {
      currentPath = path.join("/");
    }

    setCurrentPath(currentPath);

    (async () => {
      try {
        if (currentPath !== currentDirectory) {
          setIsLoading(true);
        }

        const items = await getItems(currentPath);

        dispatch(setLibraryPathExists(true));
        dispatch(setLibraryFiles(items));
        dispatch(setLibraryPath(currentPath));
      } catch (e) {
        dispatch(setLibraryFiles([]));
        dispatch(setLibraryPathExists(false));
      }

      setIsLoading(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  useEffect(() => {
    let defaultOrder = order;
    if (isRootPath(currentPath)) {
      defaultOrder = OrderEnum.HIGHLIGHT;
    }

    setItems(orderItems(defaultOrder, filterItems(filter, rawItems)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawItems]);

  const handleOrder = (order: OrderEnum) => {
    setOrder(order);
    setItems(orderItems(order, rawItems));
  };

  const handleFilter = (filter: OrderEnum) => {
    setFilter(filter);
    setItems(filterItems(filter, rawItems));
  };

  return (
    <LayoutApp title={l("title")}>
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART} extraStyle={{ padding: 0 }}>
        <HeaderBar
          path={path}
          currentPath={currentPath}
          listType={listType}
          setListType={setListType}
          setOrder={handleOrder}
          setFilter={handleFilter}
          order={order}
          filter={filter}
          pathExists={!notFoundDir}
        />
        {isLoading && <DirectoryList />}
        {!isLoading && !notFoundDir && (
          <Box width="100%">
            <ItemList items={items} type={listType} />
          </Box>
        )}
        {notFoundDir && (
          <>
            <Image alt="404 not found" src="/images/404 Error.png" width={500} height={500} />
            <Button color="primary" variant="outlined" onClick={() => router.back()}>
              {t("form.backButton")}
            </Button>
          </>
        )}
      </FlexBox>
    </LayoutApp>
  );
}

export default MyLibrary;
