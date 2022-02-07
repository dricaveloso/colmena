/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@/components/ui/SvgIcon";
import { JustifyContentEnum } from "@/enums/index";
import { toast } from "@/utils/notifications";
import { useTranslation } from "next-i18next";

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
  setOrder: null;
  setFilter: null;
  order: null;
  filter: null;
};

function HeaderBar({ setOrder, setFilter, order, filter }: Props) {
  const { t: c } = useTranslation("common");
  const classes = useStyles();

  // const filterItems = () => {
  //   setFilter(filter);
  //   handleCloseFilterDrawer();
  // };

  // const orderItems = (order: OrderEnum) => {
  //   setOrder(order);
  //   handleCloseFilterDrawer();
  // };

  // const handleCloseFilterDrawer = () => {
  //   setOpenFilterDrawer(false);
  // };

  // const handleOpenFilterDrawer = () => {
  //   setOpenFilterDrawer(true);
  // };

  const unavailable = () => {
    toast(c("featureUnavailable"), "warning");
  };

  return (
    <Box
      bgcolor="#F9F9F9"
      color="text.primary"
      justifyContent={JustifyContentEnum.FLEXEND}
      flexDirection="row"
      display="flex"
      width="100%"
    >
      <Box className={classes.options}>
        <IconButton
          color="primary"
          component="span"
          onClick={unavailable}
          aria-controls="filter-menu"
          aria-haspopup="true"
        >
          <SvgIcon icon="search" htmlColor="#292929" fontSize="small" />
        </IconButton>
        <IconButton
          color="primary"
          component="span"
          onClick={unavailable}
          aria-controls="filter-menu"
          aria-haspopup="true"
        >
          <SvgIcon icon="settings_adjust" htmlColor="#292929" fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default HeaderBar;
