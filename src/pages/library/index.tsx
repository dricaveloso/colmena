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
import { listDirectories } from "@/services/webdav/directories";
import { PropsUserSelector, PropsLibrarySelector } from "@/types/index";
import { useSelector, useDispatch } from "react-redux";
import { FileStat } from "webdav";
import { getAllAudios } from "@/store/idb/models/audios";
import FlexBox from "@/components/ui/FlexBox";
import { Box, Button } from "@material-ui/core";
import ItemList from "@/components/pages/library/ItemList";
import HeaderBar from "@/components/pages/library/HeaderBar";
import { useRouter } from "next/router";
import Loading from "@/components/ui/Loading";
import { getExtensionFilename, dateDescription } from "@/utils/utils";
import Image from "next/image";
import notFoundImage from "../../../public/images/404 Error.png";
import { useTranslation } from "react-i18next";
import {
  EnvironmentEnum,
  JustifyContentEnum,
  ListTypeEnum,
  OrderEnum,
  FilterEnum,
} from "@/enums/index";
import { setLibraryFiles, setLibraryPathExists, setLibraryPath } from "@/store/actions/library";

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
  const [order, setOrder] = useState(OrderEnum.LATEST_FIRST);
  const [filter, setFilter] = useState("");
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const timeDescription: TimeDescriptionInterface = t("timeDescription", { returnObjects: true });

  const getWebDavDirectories = useCallback(async (userId: string, currentDirectory: string) => {
    const items: LibraryItemInterface[] = [];

    const nxDirectories = await listDirectories(userId, currentDirectory);
    if (nxDirectories?.data.length > 0) {
      console.log();
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
          };

          items.push(item);
        }
      });
    }

    return items;
  }, []);

  const getLocalFiles = useCallback(async (userId: string, currentDirectory: string) => {
    const items: LibraryItemInterface[] = [];
    if (currentDirectory === "/") {
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
          };

          items.push(item);
        });
      }
    }

    return items;
  }, []);

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
          console.log(extension, textExtensions.includes(extension), textExtensions);

          return textExtensions.includes(extension);
        default:
          return item;
      }
    });
  }, []);

  useEffect(() => {
    let currentPath = "/";
    if (typeof path === "object") {
      currentPath = path.join("/");
    }

    (async () => {
      try {
        if (currentPath !== currentDirectory) {
          setIsLoading(true);
        }

        const nxDirectories = await getWebDavDirectories(userRdx.user.id, currentPath);
        const localFiles = await getLocalFiles(userRdx.user.id, currentPath);
        const items = nxDirectories.concat(localFiles);
        dispatch(setLibraryPathExists(true));
        dispatch(setLibraryFiles(items));
        dispatch(setLibraryPath(currentPath));
      } catch (e) {
        console.log(e);
        dispatch(setLibraryFiles([]));
        dispatch(setLibraryPathExists(false));
      }

      setIsLoading(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  useEffect(() => {
    setItems(orderItems(order, filterItems(filter, rawItems)));
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
    <LayoutApp title="Library">
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART} extraStyle={{ padding: 0 }}>
        <HeaderBar
          path={path}
          listType={listType}
          setListType={setListType}
          setOrder={handleOrder}
          setFilter={handleFilter}
          order={order}
          filter={filter}
          pathExists={!notFoundDir}
        />
        {isLoading && (
          <FlexBox justifyContent={JustifyContentEnum.CENTER}>
            <Loading />
          </FlexBox>
        )}
        {!isLoading && !notFoundDir && (
          <Box width="100%">
            <ItemList items={items} type={listType} />
          </Box>
        )}
        {notFoundDir && (
          <>
            <Image alt="404 not found" src={notFoundImage} width={500} height={500} />
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
