import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { Box, makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@/components/ui/SvgIcon";
import { FilterEnum, JustifyContentEnum, ListTypeEnum, OrderEnum } from "@/enums/index";
import { generateBreadcrumb } from "@/utils/utils";
import { BreadcrumbItemInterface } from "@/interfaces/index";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { AllIconProps } from "@/types/index";
import TemporaryFiltersDrawer from "./FiltersDrawer";

const useStyles = makeStyles(() => ({
  breadcrumb: {
    flex: 1,
    textAlign: "left",
    alignSelf: "center",
    padding: 1,
    overflow: "hidden",
  },
  options: {
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "row",
  },
}));

type Props = {
  path: string | string[] | undefined;
  listType: string;
  setListType: React.Dispatch<React.SetStateAction<ListTypeEnum>>;
  setFilter: React.Dispatch<React.SetStateAction<string | FilterEnum>>;
  setOrder: React.Dispatch<React.SetStateAction<OrderEnum>>;
  order: OrderEnum;
  filter: string | FilterEnum;
};

const defineIconListType = (type: string) => (type === ListTypeEnum.LIST ? "grid" : "checklist");

function HeaderBar({ path, listType, setListType, setFilter, setOrder, order, filter }: Props) {
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [iconListType, setIconListType] = useState<AllIconProps>(defineIconListType(listType));
  const { t } = useTranslation("library");
  const classes = useStyles();
  const [breadcrumb, setBreadcrumb] = useState<Array<BreadcrumbItemInterface>>(
    [] as Array<BreadcrumbItemInterface>,
  );

  useEffect(() => {
    const generatedBreadcrumb = generateBreadcrumb(path, "/library");
    const firstMenu: BreadcrumbItemInterface = {
      icon: "library",
      isCurrent: generatedBreadcrumb.length === 0,
      description: generatedBreadcrumb.length === 0 ? t("title") : undefined,
      path: "/library",
    };

    setBreadcrumb([firstMenu, ...generatedBreadcrumb]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const changeListType = () => {
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
      <Box className={classes.breadcrumb}>
        <Breadcrumb breadcrumbs={breadcrumb} />
      </Box>
      <Box className={classes.options}>
        <IconButton
          color="primary"
          component="span"
          onClick={handleOpenFilterDrawer}
          aria-controls="filter-menu"
          aria-haspopup="true"
        >
          <SvgIcon icon="settings_adjust" htmlColor="#292929" fontSize="small" />
        </IconButton>
        <IconButton color="primary" component="span" onClick={changeListType}>
          <SvgIcon icon={iconListType} htmlColor="#292929" fontSize="small" />
        </IconButton>
      </Box>
      <TemporaryFiltersDrawer
        filterItems={filterItems}
        orderItems={orderItems}
        open={openFilterDrawer}
        handleClose={handleCloseFilterDrawer}
        filter={filter}
        order={order}
      />
    </Box>
  );
}

export default HeaderBar;
