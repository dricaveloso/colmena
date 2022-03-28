import React, { useState, useCallback } from "react";
import FullScreenSearch from "@/components/ui/FooterApp/FullScreenSearch";
import DrawerBottomRecording from "@/components/ui/FooterApp/DrawerMoreOptionsBottom";
import Grid from "@material-ui/core/Grid";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { removeCornerSlash } from "@/utils/utils";
import Text from "../Text";
import { useTranslation } from "next-i18next";
import SvgIconAux from "../SvgIcon";
import Clickable from "../Clickable";
import { useRouter } from "next/router";
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
    padding: 0,
    minWidth: "50px",
    "& .MuiSvgIcon-root": {
      fontSize: "1rem",
    },
  },
  btn: {
    display: "block",
    padding: "4px 0",
  },
  title: {
    fontSize: 10,
    lineHeight: 1.6,
    letterSpacing: 0.5,
  },
}));

function AppTab({ page }: Props) {
  // const library = useSelector((state: { library: PropsLibrarySelector }) => state.library);
  // const libraryPath = library.currentPath;
  const { t } = useTranslation("common");
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
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

  const iconSize = 25;

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

  const push = (url: string) => {
    router.push(url);
  };

  return (
    <>
      <Grid container className={classes.gridContainer}>
        <Grid item xs={2}>
          <Clickable handleClick={() => push("/home")} className={classes.btn}>
            <SvgIconAux icon="home" fontSize={iconSize} htmlColor={handleMenuColor("home")} />
            <Text className={classes.title}>{t("navTitles.home")}</Text>
          </Clickable>
        </Grid>
        <Grid item xs={2}>
          <Clickable handleClick={() => push("/honeycomb")} className={classes.btn}>
            <SvgIconAux icon="panal" fontSize={iconSize} htmlColor={handleMenuColor("honeycomb")} />
            <Text className={classes.title}>{t("navTitles.honeycomb")}</Text>
          </Clickable>
        </Grid>
        <Grid item xs={2}>
          <Clickable handleClick={() => push("/library")} className={classes.btn}>
            <SvgIconAux icon="library" fontSize={iconSize} htmlColor={handleMenuColor("library")} />
            <Text className={classes.title}>{t("navTitles.library")}</Text>
          </Clickable>
        </Grid>
        <Grid item xs={2}>
          <Clickable handleClick={handleOpenDrawer} className={classes.btn}>
            <SvgIconAux
              icon="gradient_plus"
              fontSize={iconSize}
              htmlColor={theme.palette.secondary.main}
            />
            <Text className={classes.title}>{t("navTitles.tools")}</Text>
          </Clickable>
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
