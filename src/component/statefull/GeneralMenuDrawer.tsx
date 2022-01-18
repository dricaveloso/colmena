/* eslint-disable react/button-has-type */
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ListItemIcon, List, ListItem, ListItemText } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import Divider from "@material-ui/core/Divider";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/router";
import { signOut } from "next-auth/client";
import Backdrop from "@/components/ui/Backdrop";
import SvgIcon from "@/components/ui/SvgIcon";
import SwitchLanguageModal from "@/components/pages/profile/SwitchLanguageModal";
import SliderQuota from "@/components/ui/SliderQuota";
import { parseCookies } from "nookies";
import LogoSvg from "../../../public/images/svg/colmena_logo_1612.svg";

type ListItemProps = {
  id: string;
  url?: string | undefined;
  icon: any;
  color?: string | undefined;
  title?: string;
  handleClick?: () => void | undefined;
};

const useStyles = makeStyles((theme) => ({
  icon: {
    minWidth: 40,
  },
  margin: {
    margin: theme.spacing(1),
  },
  list: {
    color: "#666",
    [theme.breakpoints.down("sm")]: {
      width: "80vw",
    },
    [theme.breakpoints.up("sm")]: {
      width: "40vw",
    },
  },
}));

type Props = {
  open: boolean;
  onOpen?: () => void;
  onClose: () => void;
};

function DrawerAux({ open, onClose }: Props) {
  const classes = useStyles();
  const router = useRouter();
  const [showBackdrop, setShowBackdrop] = useState(false);
  const cookies = parseCookies();
  const [openChangeLanguage, setOpenChangeLanguage] = useState(false);

  const langCookies = cookies.NEXT_LOCALE;
  const defaultLangRouter = router.defaultLocale;

  const installRoute = defaultLangRouter === langCookies ? "/install" : `/${langCookies}/install`;

  const switchLanguageHandle = () => {
    setOpenChangeLanguage(true);
  };

  const handleCloseChangeLanguage = () => {
    setOpenChangeLanguage(false);
  };

  const { t } = useTranslation("drawer");

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

  const iconColor = "#666";
  const iconSize = "medium";

  const menuArray = [
    {
      id: uuid(),
      icon: <SvgIcon icon="global" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("languageTitle"),
      handleClick: switchLanguageHandle,
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="settings" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("settingsTitle"),
      url: "/settings",
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="user_group" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("editMediaTitle"),
      url: "/media-profile",
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="html_tag" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("tagsTitle"),
      url: "/tags",
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="user" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("userProfileTitle"),
      url: "/profile",
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="help" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("supportTitle"),
      url: "/help",
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="info" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("aboutMaia"),
      url: "/about",
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="faq" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("faqTitle"),
      url: "/faq",
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="contract" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("termsOfUse"),
      url: "/terms-of-use",
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="logout" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("logoutTitle"),
      handleClick: logoutHandler,
    },
  ];

  const getListItemButton = (
    id: string,
    icon: string,
    color?: string | undefined,
    title?: string,
  ): React.ReactNode => (
    <ListItem key={id} button>
      <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
      <ListItemText primary={title} primaryTypographyProps={{ style: { fontSize: 14 } }} />
    </ListItem>
  );

  const drawerMenu = (): React.ReactNode => (
    <div role="presentation" onClick={onClose} onKeyDown={onClose} className={classes.list}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginLeft: 20,
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <div style={{ width: 200 }}>
          <LogoSvg />
        </div>
      </div>
      <Divider light style={{ backgroundColor: "white", marginTop: 8 }} />
      <List component="nav">
        <ListItem
          key={uuid()}
          onClick={() => {
            window.location.href = installRoute;
          }}
          button
        >
          <ListItemIcon className={classes.icon}>
            <SvgIcon icon="download" fontSize={iconSize} htmlColor={iconColor} />
          </ListItemIcon>
          <ListItemText
            primary={t("downloadTitle")}
            primaryTypographyProps={{ style: { fontSize: 14 } }}
          />
        </ListItem>
        {menuArray.map((item: ListItemProps) => {
          const { id, icon, color, title, url, handleClick } = item;
          if (url)
            return (
              <Link key={uuid()} href={url}>
                {getListItemButton(id, icon, color, title)}
              </Link>
            );

          return (
            <div onClick={handleClick} key={uuid()}>
              {getListItemButton(id, icon, color, title)}
            </div>
          );
        })}
      </List>
      <div style={{ marginLeft: 15, paddingRight: 25, marginTop: 20 }}>
        <SliderQuota />
      </div>
    </div>
  );

  return (
    <div>
      <SwitchLanguageModal
        defaultLang={cookies.NEXT_LOCALE}
        open={openChangeLanguage}
        onClose={handleCloseChangeLanguage}
        backUrl={router.asPath}
      />
      <Backdrop open={showBackdrop} />
      <Drawer anchor="right" open={open} onClose={onClose}>
        <div style={{ flex: 1, backgroundColor: "white" }}>{drawerMenu()}</div>
      </Drawer>
    </div>
  );
}

export default DrawerAux;
