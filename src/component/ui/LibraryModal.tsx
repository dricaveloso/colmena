import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Library, {
  filterItems,
  getItems,
  orderItems,
  getCurrentItem,
} from "@/components/pages/library";
import { useSelector } from "react-redux";
import {
  BreadcrumbItemInterface,
  LibraryCardItemInterface,
  LibraryItemInterface,
  TimeDescriptionInterface,
} from "@/interfaces/index";
import { ListTypeEnum, OrderEnum, ButtonSizeEnum, ButtonVariantEnum } from "@/enums/*";
import { useTranslation } from "react-i18next";
import HeaderBar from "../pages/library/HeaderBar";
import { AllIconProps, PropsUserSelector } from "@/types/*";
import { isRootPath, removeInitialPath } from "@/utils/directory";
import IconButton from "@/components/ui/IconButton";
import AppBar, { tplHeader } from "@/components/statefull/AppBar";
import Button from "@/components/ui/Button";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    overflow: "hidden",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    width: "100%",
    minHeight: "100vh",
    maxHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  title: { margin: theme.spacing(0, 0, 4, 0) },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-between",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
  },
  breadcrumb: {
    flex: 1,
    flexGrow: 0,
  },
  library: {
    flexGrow: 1,
    overflow: "auto",
  },
  actions: {
    display: "flex",
    flex: 1,
    padding: 10,
    backgroundColor: "rgb(249, 249, 249)",
    flexGrow: 0,
    alignItems: "center",
    justifyContent: "flex-end",
  },
}));

type Props = {
  title?: string;
  open: boolean;
  handleClose: () => void;
  options?: (item: LibraryItemInterface) => React.ReactNode;
  rootPath?: string;
  rootIcon?: AllIconProps | undefined;
  rootDescription?: string | null;
  isDisabled?: boolean;
  footerActions?: (item: LibraryItemInterface | null) => string | React.ReactNode;
  onlyDirectories?: boolean;
};

export default function LibraryModal({
  title = "",
  open,
  handleClose,
  rootPath = "/",
  rootDescription = null,
  rootIcon = "library",
  isDisabled = false,
  options,
  footerActions,
}: Props) {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [currentItem, setCurrentItem] = useState<LibraryItemInterface | null>(null);
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
      if (path !== currentPath) {
        setIsLoading(true);
      }

      const rawItems = await getItems(path, userRdx.user.id, timeDescription);
      setCurrentItem(getCurrentItem());

      let currentOrder = order;
      if (isRootPath(path)) {
        currentOrder = OrderEnum.HIGHLIGHT;
        setOrder(currentOrder);
      } else if (!isRootPath(path) && currentOrder === OrderEnum.HIGHLIGHT) {
        currentOrder = OrderEnum.LATEST_FIRST;
        setOrder(currentOrder);
      }

      setItems(orderItems(currentOrder, filterItems(filter, rawItems)));

      setNotFoundDir(false);
      setRawItems(rawItems);
      setCurrentPath(path);
      prepareBreadcrumbPath(path);
    } catch (e) {
      setNotFoundDir(true);
      setRawItems([]);
    }

    setIsLoading(false);
  };

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
    const { type, aliasFilename } = libraryCardItem;
    if (type === "directory") {
      mountItems(aliasFilename);
      setCurrentItem(libraryCardItem);
    }
  };

  const handleBreadcrumbNavigate = (dir: BreadcrumbItemInterface) => {
    mountItems(dir.path);
  };

  useEffect(() => {
    mountItems(rootPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstBreadrcrumbMenu: BreadcrumbItemInterface = {
    icon: rootIcon,
    description: rootDescription ?? l("title"),
    path: rootPath,
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <AppBar
            title={title}
            templateHeader="variation2"
            drawer={false}
            back={false}
            extraElement={
              <IconButton
                icon="close"
                fontSizeIcon="small"
                handleClick={handleClose}
                iconColor={tplHeader.get("variation2").textColor}
                disabled={isDisabled}
              />
            }
          />
          {/* <div className={classes.header}>
            <h4 id="transition-modal-title" className={classes.title}>
              Selecione o destino
            </h4>
            <IconButton icon="close" fontSizeIcon="small" handleClick={handleClose} />
          </div> */}
          <div className={classes.breadcrumb}>
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
              isDisabled={isDisabled}
            />
          </div>
          <div className={classes.library}>
            <Library
              items={items}
              isLoading={isLoading}
              options={options}
              handleItemClick={handleItemClick}
              listType={listType}
              isDisabled={isDisabled}
            />
          </div>
          {!isLoading && (
            <div className={classes.actions}>
              <Button
                variant={ButtonVariantEnum.TEXT}
                handleClick={handleClose}
                disabled={isDisabled}
                title={l("cancel")}
                size={ButtonSizeEnum.SMALL}
              />

              {footerActions && currentItem && footerActions(currentItem)}
            </div>
          )}
        </div>
      </Fade>
    </Modal>
  );
}
