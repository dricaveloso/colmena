import React, { useState, useEffect, useCallback } from "react";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import LayoutApp from "@/components/statefull/LayoutApp";
import { GetStaticProps } from "next";
import {
  BreadcrumbItemInterface,
  I18nInterface,
  LibraryCardItemInterface,
  LibraryItemInterface,
  TimeDescriptionInterface,
} from "@/interfaces/index";
import { useSelector, useDispatch } from "react-redux";
import FlexBox from "@/components/ui/FlexBox";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import {
  ContextMenuEventEnum,
  ContextMenuOptionEnum,
  JustifyContentEnum,
  ListTypeEnum,
  OrderEnum,
} from "@/enums/index";
import {
  setLibraryFiles,
  setLibraryPathExists,
  setLibraryPath,
  editLibraryFile,
  addLibraryFile,
  removeLibraryFile,
} from "@/store/actions/library";
import Library, { filterItems, getItems, orderItems } from "@/components/pages/library";
import { PropsLibrarySelector, PropsUserSelector } from "@/types/*";
import ContextMenuOptions from "@/components/pages/library/contextMenu";
import { toast } from "@/utils/notifications";
import { removeCornerSlash, removeFirstSlash } from "@/utils/utils";
import IconButton from "@/components/ui/IconButton";
import {
  getAudioPath,
  getPath,
  hasExclusivePath,
  isRootPath,
  pathIsInFilename,
} from "@/utils/directory";
import HeaderBar from "@/components/pages/library/HeaderBar";
import { Button } from "@material-ui/core";
import Image from "next/image";
import { v4 as uuid } from "uuid";

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

  const unavailable = () => {
    toast(t("featureUnavailable"), "warning");
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
          await dispatch(editLibraryFile(extraInfo.oldId, item));

          return;
        }

        await dispatch(editLibraryFile(item.id, item));
        break;
      case ContextMenuEventEnum.CREATE:
        if (option === ContextMenuOptionEnum.DUPLICATE) {
          await dispatch(addLibraryFile(item));

          return;
        }

        router.push(`/library/${removeFirstSlash(getPath(item.aliasFilename))}`);
        break;
      case ContextMenuEventEnum.DELETE:
        await dispatch(removeLibraryFile(item.id));
        break;
      default:
        break;
    }
  };

  const options = (
    cardItem: LibraryCardItemInterface,
    playIconComp: React.ReactNode | undefined = undefined,
  ) => {
    const { filename, basename, orientation } = cardItem;
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

    if (playIconComp) options.push(playIconComp);

    if (!hasExclusivePath(filename) && removeCornerSlash(filename).split("/").length > 1) {
      if (!pathIsInFilename(getAudioPath(), filename) && orientation === "vertical") {
        options.push(shareOption);
      }

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
    }

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

  const mountItems = useCallback(
    async (path: string) => {
      try {
        if (path !== currentDirectory) {
          setIsLoading(true);
        }

        const items = await getItems(path, userRdx.user.id, timeDescription, l);

        dispatch(setLibraryPathExists(true));
        dispatch(setLibraryFiles(items));
        dispatch(setLibraryPath(path));
      } catch (e) {
        console.log(e);
        dispatch(setLibraryFiles([]));
        dispatch(setLibraryPathExists(false));
      }

      setIsLoading(false);
    },
    [currentDirectory, dispatch, l, timeDescription, userRdx.user.id],
  );

  useEffect(() => {
    let currentPath = "/";
    if (typeof path === "object") {
      currentPath = path.join("/");
    }

    setCurrentPath(currentPath);
    mountItems(currentPath);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawItems]);

  const handleOrder = (order: OrderEnum) => {
    setOrder(order);
    setItems(orderItems(order, filterItems(filter, rawItems)));
  };

  const handleFilter = (filter: OrderEnum) => {
    setFilter(filter);
    setItems(orderItems(order, filterItems(filter, rawItems)));
  };

  const handleItemClick = ({ type, aliasFilename, filename }: LibraryCardItemInterface) => {
    if (type === "directory" && router.query.path !== aliasFilename) {
      router.push(`/library/${aliasFilename}`);
    } else if (type === "file") {
      router.push(`/file/${btoa(filename)}`);
    }
  };

  const handleBreadcrumbNavigate = (dir: BreadcrumbItemInterface) => {
    router.push(dir.path);
  };

  const firstBreadrcrumbMenu: BreadcrumbItemInterface = {
    icon: "library",
    description: l("title"),
    path: "/library",
  };

  return (
    <LayoutApp title={l("title")} back>
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART} extraStyle={{ padding: 0 }}>
        <HeaderBar
          key="library-modal"
          path={path}
          currentPath={currentPath}
          listType={listType}
          setListType={setListType}
          setOrder={handleOrder}
          setFilter={handleFilter}
          order={order}
          filter={filter}
          pathExists={!notFoundDir}
          handleNavigate={handleBreadcrumbNavigate}
          firstBreadcrumbItem={firstBreadrcrumbMenu}
        />
        {!notFoundDir ? (
          <Library
            items={items}
            options={options}
            bottomOptions={bottomOptions}
            handleItemClick={handleItemClick}
            listType={listType}
            isLoading={isLoading}
          />
        ) : (
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
