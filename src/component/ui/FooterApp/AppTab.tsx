import React, { useState } from "react";
import IconButton from "@/components/ui/IconButton";
import FullScreenSearch from "@/components/ui/FooterApp/FullScreenSearch";
import DrawerBottomRecording from "@/components/ui/FooterApp/DrawerMoreOptionsBottom";
import Grid from "@material-ui/core/Grid";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { PropsLibrarySelector } from "@/types/index";
import { useSelector } from "react-redux";

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
  const library = useSelector((state: { library: PropsLibrarySelector }) => state.library);
  const libraryPath = library.currentPath;
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

  return (
    <>
      <Grid container className={classes.gridContainer}>
        <Grid item xs={2}>
          <IconButton
            icon="home"
            url="/home"
            fontSizeIcon="medium"
            color={page === "/home" ? theme.palette.primary.main : theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton
            icon="library"
            url={`/library/${libraryPath}`}
            fontSizeIcon="medium"
            color={
              page === `/library/${libraryPath}`
                ? theme.palette.primary.main
                : theme.palette.primary.main
            }
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton
            icon="plus"
            fontSizeIcon="medium"
            handleClick={handleOpenDrawer}
            color="#fff"
            className={classes.btnMore}
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton
            icon="gradient_panal"
            fontSizeIcon="medium"
            url="/honeycomb"
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton
            icon="global"
            fontSizeIcon="medium"
            url="/tools"
            color={page === "/tools" ? theme.palette.primary.main : theme.palette.primary.main}
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
