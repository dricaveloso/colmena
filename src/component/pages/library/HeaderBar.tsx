import React, { useState, useEffect } from "react";
import { Box, makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@/components/ui/SvgIcon";
import {
  FilterEnum,
  JustifyContentEnum,
  ListTypeEnum,
  OrderEnum,
  LanguageEnum,
} from "@/enums/index";
import { generateBreadcrumb } from "@/utils/utils";
import { BreadcrumbItemInterface } from "@/interfaces/index";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { AllIconProps } from "@/types/index";
import TemporaryFiltersDrawer from "./FiltersDrawer";
import { isRootPath } from "@/utils/directory";
import { useDispatch } from "react-redux";
import { setCurrentAudioPlaying } from "@/store/actions/library/index";

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
  setLanguage: React.Dispatch<React.SetStateAction<LanguageEnum>>;
  order: OrderEnum;
  filter: string | FilterEnum;
  language: string | LanguageEnum;
  pathExists: boolean;
  handleNavigate: (dir: BreadcrumbItemInterface) => void;
  hasFilter?: boolean;
  canChangeList?: boolean;
  firstBreadcrumbItem?: BreadcrumbItemInterface;
  isDisabled?: boolean;
};

const defineIconListType = (type: string) => (type === ListTypeEnum.LIST ? "grid" : "checklist");

function HeaderBar({
  path,
  currentPath,
  listType,
  setListType,
  setFilter,
  setOrder,
  setLanguage,
  order,
  filter,
  language,
  pathExists,
  handleNavigate,
  hasFilter = true,
  canChangeList = true,
  firstBreadcrumbItem,
  isDisabled = false,
}: Props) {
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [iconListType, setIconListType] = useState<AllIconProps>(defineIconListType(listType));
  const classes = useStyles();
  const dispatch = useDispatch();
  const [breadcrumb, setBreadcrumb] = useState<Array<BreadcrumbItemInterface>>(
    [] as Array<BreadcrumbItemInterface>,
  );

  useEffect(() => {
    if (firstBreadcrumbItem) {
      const generatedBreadcrumb = generateBreadcrumb(path, firstBreadcrumbItem.path);
      const newBreadcrumbItem = {
        ...firstBreadcrumbItem,
        isCurrent: generatedBreadcrumb.length === 0,
        description: generatedBreadcrumb.length === 0 ? firstBreadcrumbItem.description : undefined,
      };

      setBreadcrumb([newBreadcrumbItem, ...generatedBreadcrumb]);
    } else {
      const generatedBreadcrumb = generateBreadcrumb(path);
      setBreadcrumb(generatedBreadcrumb);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const changeListType = () => {
    dispatch(setCurrentAudioPlaying(""));
    setIconListType(defineIconListType(listType));
    setListType(listType === ListTypeEnum.LIST ? ListTypeEnum.GRID : ListTypeEnum.LIST);
  };

  const filterItems = (filter: FilterEnum) => {
    setFilter(filter);
    handleCloseFilterDrawer();
  };

  const filterItemsByLanguage = (language: LanguageEnum) => {
    setLanguage(language);
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
      <Box className={classes.breadcrumb}>
        <Breadcrumb
          breadcrumbs={breadcrumb}
          handleNavigate={handleNavigate}
          isDisabled={isDisabled}
        />
      </Box>
      {pathExists && (
        <Box className={classes.options}>
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

          {canChangeList && (
            <IconButton
              color="primary"
              component="span"
              onClick={changeListType}
              disabled={isDisabled}
            >
              <SvgIcon icon={iconListType} htmlColor="#292929" fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}

      <TemporaryFiltersDrawer
        filterItems={filterItems}
        orderItems={orderItems}
        filterItemsByLanguage={filterItemsByLanguage}
        open={openFilterDrawer}
        handleClose={handleCloseFilterDrawer}
        filter={filter}
        order={order}
        language={language}
        isRootPath={isRootPath(currentPath)}
      />
    </Box>
  );
}

export default HeaderBar;
