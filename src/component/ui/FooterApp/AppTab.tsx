import React, { useState, useCallback } from "react";
import IconButton from "@/components/ui/IconButton";
import FullScreenSearch from "@/components/ui/FooterApp/FullScreenSearch";
import DrawerBottomRecording from "@/components/ui/FooterApp/DrawerMoreOptionsBottom";
import Grid from "@material-ui/core/Grid";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { removeCornerSlash } from "@/utils/utils";
// import { PropsLibrarySelector } from "@/types/index";
// import { useSelector } from "react-redux";

type Props = {
  page: string;
};

const useStyles = makeStyles(() => ({
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    zIndex: 1200,
    "& a.MuiButtonBase-root": {
      width: "100%",
    },
  },
  btnMore: {
    background: "linear-gradient(118.66deg, #534BAE 5.24%, #D53E7E 103.53%)!important",
    borderRadius: 8,
    padding: "8px!important",
    minWidth: "50px",
    "& .MuiSvgIcon-root": {
      fontSize: "1rem",
    },
  },
}));

function AppTab({ page }: Props) {
  // const library = useSelector((state: { library: PropsLibrarySelector }) => state.library);
  // const libraryPath = library.currentPath;
  const classes = useStyles();
  const theme = useTheme();
  const [openSearch, setOpenSearch] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleClose = () => {
    setOpenSearch(false);
  };

  // const handleOpen = () => {
  //   setOpenSearch(true);
  // };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };

  const iconSize = 28;

  const handleMenuColor = useCallback(
    (rootPath) => {
      const splitPage = removeCornerSlash(page).split("/");
      if (splitPage.length > 0 && splitPage[0] === rootPath) {
        return theme.palette.primary.main;
      }

      return theme.palette.gray.main;
    },
    [page, theme.palette.gray.main, theme.palette.primary.main],
  );

  return (
    <>
      <Grid container className={classes.gridContainer}>
        <Grid item xs={2}>
          <IconButton
            icon="home"
            url="/home"
            fontSizeIcon={iconSize}
            iconColor={handleMenuColor("home")}
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton
            icon="library"
            url="/library"
            fontSizeIcon={iconSize}
            iconColor={handleMenuColor("library")}
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton
            icon="panal"
            fontSizeIcon={iconSize}
            url="/honeycomb"
            iconColor={handleMenuColor("honeycomb")}
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton
            icon="gradient_plus"
            fontSizeIcon={30}
            handleClick={handleOpenDrawer}
            iconColor="#fff"
          />
        </Grid>
      </Grid>
      <FullScreenSearch open={openSearch} handleClose={handleClose} />
      <DrawerBottomRecording
        open={openDrawer}
        handleOpen={handleOpenDrawer}
        handleClose={handleCloseDrawer}
      />
    </>
  );
}

export default AppTab;
