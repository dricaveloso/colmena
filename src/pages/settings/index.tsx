import React, { useState, useEffect } from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { AlignItemsEnum, JustifyContentEnum } from "@/enums/index";
import WhiteSpaceFooter from "@/components/ui/WhiteSpaceFooter";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import PersonIcon from "@material-ui/icons/Person";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import SecurityIcon from "@material-ui/icons/Security";
import CloudCircleIcon from "@material-ui/icons/CloudCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import LanguageIcon from "@material-ui/icons/Language";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import UserAvatar from "@/components/pages/profile/Avatar";
import { useRouter } from "next/router";
import { signOut } from "next-auth/client";
import Backdrop from "@/components/ui/Backdrop";
import theme from "@/styles/theme";
import SwitchLanguageModal from "@/components/pages/profile/SwitchLanguageModal";
import { parseCookies } from "nookies";
import Switch from "@material-ui/core/Switch";
import { toast } from "@/utils/notifications";
import { currentDirection } from "@/utils/i18n";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["settings"])),
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // maxWidth: 360,
    textAlign: "left",
    "& .MuiListItem-root": {
      backgroundColor: theme.palette.background.paper,
    },
  },
  rootForRtl: {
    width: "100%",
    textAlign: "right",
    "& .MuiListItem-root": {
      backgroundColor: theme.palette.background.paper,
    },
  },
}));

function Settings() {
  const { t } = useTranslation("settings");
  const { t: c } = useTranslation("common");
  const { t: d } = useTranslation("drawer");
  const router = useRouter();
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [openChangeLanguage, setOpenChangeLanguage] = useState(false);
  const [checked, setChecked] = useState(["wifi"]);
  const cookies = parseCookies();

  const unavailable = () => {
    toast(c("featureUnavailable"), "warning");
  };

  const switchLanguageHandle = () => {
    setOpenChangeLanguage(true);
  };

  const [language, setLanguage] = useState("");

  const handleCloseChangeLanguage = () => {
    setOpenChangeLanguage(false);
  };

  const classes = useStyles();

  const logoutHandler = async () => {
    if (navigator.onLine) {
      try {
        setShowBackdrop(true);
        await signOut({ redirect: false });
      } finally {
        setShowBackdrop(false);
        router.push("/login");
      }
    }
  };

  useEffect(() => {
    setLanguage(currentDirection());
  }, [language]);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <LayoutApp title={t("title")} back>
      <SwitchLanguageModal
        defaultLang={cookies.NEXT_LOCALE}
        open={openChangeLanguage}
        onClose={handleCloseChangeLanguage}
        backUrl={router.pathname}
      />
      <Backdrop open={showBackdrop} />
      <FlexBox
        padding={0}
        justifyContent={JustifyContentEnum.FLEXSTART}
        alignItems={AlignItemsEnum.FLEXSTART}
      >
        <List
          subheader={
            <ListSubheader style={{ fontWeight: "bold" }}>{t("profileTitle")}</ListSubheader>
          }
          className={language === "rtl" ? classes.rootForRtl : classes.root}
        >
          <ListItem divider button onClick={() => router.push("/profile")}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText id="change-profile-info" primary={t("changeProfileTitle")} />
            <ListItemSecondaryAction>
              <UserAvatar size={4} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={switchLanguageHandle}>
            <ListItemIcon>
              <LanguageIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              id="change-profile-info"
              primary={t("changeLangTitle")}
              secondary={t("changeLangSubtitle", { lang: cookies.NEXT_LOCALE })}
            />
            <ListItemSecondaryAction>
              <ArrowForwardIosIcon fontSize="small" style={{ color: theme.palette.icon.dark }} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        <List
          subheader={
            <ListSubheader style={{ fontWeight: "bold" }}>{t("generalTitle")}</ListSubheader>
          }
          className={language === "rtl" ? classes.rootForRtl : classes.root}
        >
          <ListItem divider>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText id="notifications" primary={t("notificationTitle")} />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                onChange={handleToggle("bluetooth")}
                checked={checked.indexOf("bluetooth") !== -1}
                inputProps={{ "aria-labelledby": "switch-list-label-bluetooth" }}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={unavailable}>
            <ListItemIcon>
              <CloudCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText id="cloud-management" primary={t("cloudManagementTitle")} />
            <ListItemSecondaryAction>
              <ArrowForwardIosIcon fontSize="small" style={{ color: theme.palette.icon.dark }} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={unavailable}>
            <ListItemIcon>
              <SecurityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText id="privacy-management" primary={t("privacyManagementTitle")} />
            <ListItemSecondaryAction>
              <ArrowForwardIosIcon fontSize="small" style={{ color: theme.palette.icon.dark }} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={unavailable}>
            <ListItemIcon>
              <DeleteForeverIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText id="clear-cache" primary={t("clearCacheTitle")} />
            <ListItemSecondaryAction>
              <ArrowForwardIosIcon fontSize="small" style={{ color: theme.palette.icon.dark }} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider button onClick={logoutHandler}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" style={{ color: "tomato" }} />
            </ListItemIcon>
            <ListItemText
              id="switch-list-label-bluetooth"
              primaryTypographyProps={{ style: { color: "tomato" } }}
              primary={d("logoutTitle")}
            />
          </ListItem>
        </List>
      </FlexBox>
      <WhiteSpaceFooter />
    </LayoutApp>
  );
}

export default Settings;
