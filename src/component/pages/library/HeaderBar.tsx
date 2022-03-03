import React, { useState, useEffect } from "react";
import { Box, makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@/components/ui/SvgIcon";
import { FilterEnum, JustifyContentEnum, ListTypeEnum, OrderEnum } from "@/enums/index";
import { generateBreadcrumb, removeCornerSlash } from "@/utils/utils";
import { BreadcrumbItemInterface } from "@/interfaces/index";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { AllIconProps } from "@/types/index";
import TemporaryFiltersDrawer from "./FiltersDrawer";
import { getPublicPath, getTalkPath, isRootPath } from "@/utils/directory";
import { useDispatch } from "react-redux";
import { setCurrentAudioPlaying } from "@/store/actions/library/index";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const useStyles = makeStyles(() => ({
  breadcrumb: {
    flex: 1,
    textAlign: "left",
    alignSelf: "center",
    padding: 1,
    overflow: "hidden",
    alignItems: "center",
  },
  options: {
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "row",
  },
}));

type Props = {
  path: string | string[] | undefined;
  currentPath: string;
  listType: string;
  setListType: React.Dispatch<React.SetStateAction<ListTypeEnum>>;
  setFilter: React.Dispatch<React.SetStateAction<string | FilterEnum>>;
  setOrder: React.Dispatch<React.SetStateAction<OrderEnum>>;
  order: OrderEnum;
  filter: string | FilterEnum;
  pathExists: boolean;
  handleNavigate: (dir: BreadcrumbItemInterface) => void;
  hasFilter?: boolean;
  canChangeList?: boolean;
  firstBreadcrumbItem?: BreadcrumbItemInterface;
  isDisabled?: boolean;
  rootPath?: string;
};

const defineIconListType = (type: string) => (type === ListTypeEnum.LIST ? "grid" : "checklist");

function HeaderBar({
  path,
  currentPath,
  listType,
  setListType,
  setFilter,
  setOrder,
  order,
  filter,
  pathExists,
  handleNavigate,
  hasFilter = true,
  canChangeList = true,
  firstBreadcrumbItem,
  isDisabled = false,
  rootPath = "/",
}: Props) {
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [iconListType, setIconListType] = useState<AllIconProps>(defineIconListType(listType));
  const router = useRouter();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation("library");
  const [breadcrumb, setBreadcrumb] = useState<Array<BreadcrumbItemInterface>>(
    [] as Array<BreadcrumbItemInterface>,
  );

  useEffect(() => {
    let currentPath = path;
    if (rootPath !== "/" && currentPath) {
      if (typeof currentPath === "object") {
        currentPath = currentPath.join("/");
      }

      const regex = new RegExp(`^${rootPath}`);
      currentPath = currentPath.replace(regex, "").split("/");
    }

    if (firstBreadcrumbItem) {
      const generatedBreadcrumb = generateBreadcrumb(currentPath, firstBreadcrumbItem.path);
      const newBreadcrumbItem = {
        ...firstBreadcrumbItem,
        isCurrent: generatedBreadcrumb.length === 0,
        description: generatedBreadcrumb.length === 0 ? firstBreadcrumbItem.description : undefined,
      };

      setBreadcrumb(handleBreadcrumb([newBreadcrumbItem, ...generatedBreadcrumb]));
    } else {
      const generatedBreadcrumb = generateBreadcrumb(currentPath);
      setBreadcrumb(handleBreadcrumb(generatedBreadcrumb));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const handleBreadcrumb = (items: Array<BreadcrumbItemInterface>) =>
    items.map((item) => {
      const newItem = item;
      const path = removeCornerSlash(newItem.path.replace(/^\/library\//, ""));
      if (path === getTalkPath()) {
        newItem.description = t("talkFolderName");
      } else if (path === getPublicPath()) {
        newItem.description = t("publicFolderName");
      }

      return newItem;
    });

  const changeListType = () => {
    dispatch(setCurrentAudioPlaying(""));
    setIconListType(defineIconListType(listType));
    setListType(listType === ListTypeEnum.LIST ? ListTypeEnum.GRID : ListTypeEnum.LIST);
  };

  const filterItems = (filter: FilterEnum) => {
    setFilter(filter);
    handleCloseFilterDrawer();
  };

  const orderItems = (order: OrderEnum) => {
    setOrder(order);
    handleCloseFilterDrawer();
  };

  const handleCloseFilterDrawer = () => {
    setOpenFilterDrawer(false);
  };

  const handleOpenFilterDrawer = () => {
    setOpenFilterDrawer(true);
  };

  return (
    <Box
      bgcolor="#F9F9F9"
      color="text.primary"
      justifyContent={JustifyContentEnum.SPACEBETWEEN}
      flexDirection="row"
      display="flex"
      width="100%"
    >
      {pathExists && canChangeList && (
        <IconButton color="primary" component="span" onClick={changeListType} disabled={isDisabled}>
          <SvgIcon icon={iconListType} htmlColor="#292929" fontSize="small" />
        </IconButton>
      )}
      <Box className={classes.breadcrumb}>
        {breadcrumb.length > 1 && (
          <Breadcrumb
            breadcrumbs={breadcrumb}
            handleNavigate={handleNavigate}
            isDisabled={isDisabled}
          />
        )}
      </Box>
      {pathExists && (
        <Box className={classes.options}>
          <IconButton
            color="primary"
            component="span"
            onClick={() => router.push("library-search")}
            aria-controls="filter-menu"
            aria-haspopup="true"
            disabled={isDisabled}
          >
            <SvgIcon icon="search" htmlColor="#292929" fontSize="small" />
          </IconButton>
          {hasFilter && (
            <IconButton
              color="primary"
              component="span"
              onClick={handleOpenFilterDrawer}
              aria-controls="filter-menu"
              aria-haspopup="true"
              disabled={isDisabled}
            >
              <SvgIcon icon="settings_adjust" htmlColor="#292929" fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}

      <TemporaryFiltersDrawer
        filterItems={filterItems}
        orderItems={orderItems}
        open={openFilterDrawer}
        handleClose={handleCloseFilterDrawer}
        filter={filter}
        order={order}
        isRootPath={isRootPath(currentPath)}
      />
    </Box>
  );
}

export default HeaderBar;
