/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Library, { filterItems, getItems, orderItems } from "@/components/pages/library";
import { useSelector } from "react-redux";
import {
  BreadcrumbItemInterface,
  LibraryCardItemInterface,
  LibraryItemInterface,
  TimeDescriptionInterface,
} from "@/interfaces/index";
import { ContextMenuEventEnum, ContextMenuOptionEnum, ListTypeEnum, OrderEnum } from "@/enums/*";
import { useTranslation } from "react-i18next";
import HeaderBar from "@/components/pages/library/HeaderBar";
import { PropsUserSelector } from "@/types/*";
import {
  isRootPath,
  removeInitialPath,
  getAudioPath,
  hasExclusivePath,
  pathIsInFilename,
  getPath,
} from "@/utils/directory";
import { findGroupFolderByPath, removeCornerSlash, isAudioFile } from "@/utils/utils";
import { toast } from "@/utils/notifications";
import IconButton from "@/components/ui/IconButton";
import ContextMenuOptions from "@/components/pages/library/contextMenu";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/router";
import { Box, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  library: {
    padding: "0 10px",
  },
}));
type Props = {
  conversationName: string;
  canDeleteConversation: number;
};

function HoneycombLibrary({ conversationName, canDeleteConversation }: Props) {
  const classes = useStyles();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [rootPath, setRootPath] = useState("");
  const [breadcrumbPath, setBreadcrumbPath] = useState<string[]>([]);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [rawItems, setRawItems] = useState<Array<LibraryItemInterface>>([]);
  const [items, setItems] = useState<Array<LibraryItemInterface>>(
    [] as Array<LibraryItemInterface>,
  );
  const [listType, setListType] = useState(ListTypeEnum.LIST);
  const [order, setOrder] = useState(OrderEnum.LATEST_FIRST);
  const [filter, setFilter] = useState("");
  const [notFoundDir, setNotFoundDir] = useState(false);
  const { t } = useTranslation("common");
  const { t: l } = useTranslation("library");
  const timeDescription: TimeDescriptionInterface = t("timeDescription", { returnObjects: true });

  const mountItems = async (path: string) => {
    try {
      const rawItems = await getItems(path, userRdx.user.id, timeDescription, l);

      setNotFoundDir(false);
      setCurrentPath(path);
      prepareBreadcrumbPath(path);
      setRawItems(rawItems);
    } catch (e) {
      setNotFoundDir(true);
      setRawItems([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    let currentOrder = order;
    if (isRootPath(currentPath)) {
      currentOrder = OrderEnum.HIGHLIGHT;
      setOrder(currentOrder);
    } else if (!isRootPath(currentPath) && currentOrder === OrderEnum.HIGHLIGHT) {
      currentOrder = OrderEnum.LATEST_FIRST;
      setOrder(currentOrder);
    }

    setItems(orderItems(currentOrder, filterItems(filter, rawItems)));
  }, [rawItems, currentPath, order, filter]);

  const prepareBreadcrumbPath = (path: string) => {
    if (path !== "" && path !== "/") {
      const finalPath = removeInitialPath(path, rootPath);
      const splitedPath = finalPath.split("/");
      const breadcrumbPath = splitedPath.filter((path) => path !== "");
      setBreadcrumbPath(breadcrumbPath);
    } else {
      setBreadcrumbPath([]);
    }
  };

  const handleOrder = (order: OrderEnum) => {
    setOrder(order);
    setItems(orderItems(order, filterItems(filter, rawItems)));
  };

  const handleFilter = (filter: OrderEnum) => {
    setFilter(filter);
    setItems(orderItems(order, filterItems(filter, rawItems)));
  };

  const handleItemClick = (libraryCardItem: LibraryCardItemInterface) => {
    const { type, aliasFilename, filename } = libraryCardItem;
    if (type === "directory") {
      mountItems(aliasFilename);
    } else if (type === "file") {
      router.push(`/file/${btoa(filename)}`);
    }
  };

  const unavailable = () => {
    toast(t("featureUnavailable"), "warning");
  };

  const deleteItem = (item: LibraryItemInterface) => {
    setRawItems(rawItems.filter((rawItem) => item.id !== rawItem.id));
  };

  const updateItem = (id: number | string, item: LibraryItemInterface) => {
    setRawItems(
      rawItems.map((rawItem) => {
        if (id === rawItem.id) {
          return item;
        }

        return rawItem;
      }),
    );
  };

  const createItem = (item: LibraryItemInterface) => {
    const path = getPath(item.filename);
    if (rootPath === path) {
      setRawItems([...rawItems, item]);
    }
  };

  const handleContextMenuUpdate = async (
    item: LibraryItemInterface,
    event: ContextMenuEventEnum,
    option: ContextMenuOptionEnum,
    extraInfo: any,
  ) => {
    switch (event) {
      case ContextMenuEventEnum.UPDATE:
        if (option === ContextMenuOptionEnum.AVAILABLE_OFFLINE) {
          updateItem(extraInfo.oldId, item);

          return;
        }

        updateItem(item.id, item);
        break;
      case ContextMenuEventEnum.CREATE:
        createItem(item);

        if (option === ContextMenuOptionEnum.MOVE) {
          deleteItem(extraInfo.oldItem);
        }
        break;
      case ContextMenuEventEnum.DELETE:
        deleteItem(item);
        break;
      default:
        break;
    }
  };

  const options = (
    cardItem: LibraryCardItemInterface,
    playIconComp: React.ReactNode | undefined = undefined,
  ) => {
    const { basename, mime } = cardItem;
    const options = [];
    const shareOption = (
      <IconButton
        key={`${uuid()}-share`}
        icon="share"
        color="#9A9A9A"
        style={{ padding: 0, margin: 0, minWidth: 30 }}
        fontSizeIcon="small"
        handleClick={unavailable}
      />
    );

    /* if (playIconComp) options.push(playIconComp);

    if (!isAudioFile(mime)) {
      options.push(shareOption);
    } */

    options.push(shareOption);

    options.push(
      <ContextMenuOptions
        key={`${basename}-more-options`}
        {...cardItem}
        availableOptions={[
          ContextMenuOptionEnum.EDIT,
          ContextMenuOptionEnum.COPY,
          ContextMenuOptionEnum.MOVE,
          ContextMenuOptionEnum.DETAILS,
          ContextMenuOptionEnum.AVAILABLE_OFFLINE,
          ContextMenuOptionEnum.DOWNLOAD,
          ContextMenuOptionEnum.DELETE,
          ContextMenuOptionEnum.DUPLICATE,
          ContextMenuOptionEnum.PUBLISH,
          ContextMenuOptionEnum.RENAME,
        ]}
        onChange={handleContextMenuUpdate}
      />,
    );

    return options;
  };

  const bottomOptions = (
    cardItem: LibraryCardItemInterface,
    playIconComp: React.ReactNode | undefined = undefined,
    badgeStatusGrid: React.ReactNode | undefined = undefined,
  ) => {
    const { filename, basename, orientation } = cardItem;
    const options = [];
    if (playIconComp) options.push(playIconComp);

    const shareOption = (
      <IconButton
        key={`${basename}-share`}
        icon="share"
        color="#9A9A9A"
        style={{ padding: 0, margin: 0, minWidth: 30 }}
        fontSizeIcon="small"
        handleClick={unavailable}
      />
    );

    if (!hasExclusivePath(filename) && removeCornerSlash(filename).split("/").length > 1) {
      if (!pathIsInFilename(getAudioPath(), filename) && orientation === "horizontal") {
        options.push(shareOption);
      }
    }

    if (badgeStatusGrid) options.push(badgeStatusGrid);

    return options;
  };

  const handleBreadcrumbNavigate = (dir: BreadcrumbItemInterface) => {
    mountItems(dir.path);
  };

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      let rootPath = conversationName;
      if (!canDeleteConversation) {
        const isGroupFolder = await findGroupFolderByPath(conversationName);
        if (!isGroupFolder) {
          rootPath = `Talk/${conversationName}`;
        }
      }

      setRootPath(rootPath);
      mountItems(rootPath);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationName]);

  const firstBreadrcrumbMenu: BreadcrumbItemInterface = {
    icon: "library",
    description: "Library",
    path: rootPath,
  };

  return (
    <>
      <HeaderBar
        key="library-modal-breadcrumb"
        path={breadcrumbPath}
        currentPath={currentPath}
        listType={listType}
        setListType={setListType}
        setOrder={handleOrder}
        setFilter={handleFilter}
        order={order}
        filter={filter}
        pathExists={!notFoundDir}
        handleNavigate={handleBreadcrumbNavigate}
        canChangeList={false}
        hasFilter={false}
        firstBreadcrumbItem={firstBreadrcrumbMenu}
        rootPath={rootPath}
      />
      <Box className={classes.library}>
        <Library
          items={items}
          isLoading={isLoading}
          handleItemClick={handleItemClick}
          listType={listType}
          options={options}
          bottomOptions={bottomOptions}
        />
      </Box>
    </>
  );
}

export default HoneycombLibrary;
