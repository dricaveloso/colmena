import React, { useState } from "react";
import IconButton from "@/components/ui/IconButton";
import FullScreenSearch from "@/components/ui/FooterApp/FullScreenSearch";
import DrawerBottomRecording from "@/components/ui/FooterApp/DrawerBottomRecording";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";

type Props = {
  page: string;
};

function AppTab({ page }: Props) {
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
      <div
        style={{
          position: "absolute",
          margin: "0 auto",
          bottom: 0,
          width: 50,
          height: 50,
          backgroundColor: theme.palette.primary.light,
          borderRadius: "50%",
          marginBottom: 12,
          borderColor: "white",
          borderWidth: "medium",
          borderStyle: "solid",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <IconButton
          icon="plus"
          fontSizeIcon="large"
          handleClick={handleOpenDrawer}
          color={theme.palette.primary.contrastText}
        />
      </div>
      <Grid container spacing={3}>
        <Grid item xs={1}></Grid>
        <Grid item xs={2}>
          <IconButton
            icon="home"
            url="/home"
            fontSizeIcon="medium"
            color={
              page === "/home"
                ? theme.palette.primary.contrastText
                : theme.palette.primary.contrastText
            }
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton
            icon="library"
            url="/library"
            fontSizeIcon="medium"
            color={
              page === "/library" ? theme.palette.primary.light : theme.palette.primary.contrastText
            }
          />
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}>
          <IconButton
            icon="search"
            fontSizeIcon="medium"
            handleClick={handleOpen}
            color={theme.palette.primary.contrastText}
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton
            icon="global"
            fontSizeIcon="medium"
            url="/tools"
            color={
              page === "/tools"
                ? theme.palette.primary.contrastText
                : theme.palette.primary.contrastText
            }
          />
        </Grid>
        <Grid item xs={1}></Grid>
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
