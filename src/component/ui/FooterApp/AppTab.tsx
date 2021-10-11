import React, { useState } from "react";
import IconButton from "@/components/ui/IconButton";
import FullScreenSearch from "@/components/ui/FooterApp/FullScreenSearch";
import DrawerBottomRecording from "@/components/ui/FooterApp/DrawerBottomRecording";
import Grid from "@material-ui/core/Grid";
import { useTheme, makeStyles } from "@material-ui/core/styles";

type Props = {
  page: string;
};

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 60,
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
  const classes = useStyles();
  const theme = useTheme();
  const [openSearch, setOpenSearch] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleClose = () => {
    setOpenSearch(false);
  };

  const handleOpen = () => {
    setOpenSearch(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };

  return (
    <>
      <Grid container spacing={3} className={classes.gridContainer}>
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
            url="/library"
            fontSizeIcon="medium"
            color={page === "/library" ? theme.palette.primary.main : theme.palette.primary.main}
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
            icon="gradient-panal"
            fontSizeIcon="medium"
            url="/home"
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
