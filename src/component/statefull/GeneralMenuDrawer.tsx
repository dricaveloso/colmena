/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from "react";
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
// import SliderQuota from "@/components/ui/SliderQuota";
import { parseCookies } from "nookies";
import LogoSvg from "../../../public/images/svg/colmena_logo_1612.svg";
import { isSubadminProfile } from "@/utils/permissions";
import { currentDirection } from "@/utils/i18n";

import classNames from "classnames";

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
  listSartLeft: {
    marginLeft: 30,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    color: "#666",
    [theme.breakpoints.down("sm")]: {
      width: "80vw",
    },
    [theme.breakpoints.up("sm")]: {
      width: "40vw",
    },
  },
  headeItem: {
    marginRight: 0,
    display: "flex",
    flexDirection: "row-reverse",
  },
  listItem: {
    display: "flex",
    flexDirection: "row-reverse",
  },
}));

type Props = {
  open: boolean;
  onOpen?: () => void;
  onClose: () => void;
};

function DrawerAux({ open, onClose }: Props) {
  const [language, setLanguage] = useState("");
  useEffect(() => {
    setLanguage(currentDirection());
  }, [language]);
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
      setShowBackdrop(true);
      await signOut({ redirect: false });
      setShowBackdrop(false);
      router.push("/login?out");
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
      onlyAdmin: false,
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="settings" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("settingsTitle"),
      url: "/settings",
      onlyAdmin: false,
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="user_group" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("editMediaTitle"),
      url: "/media-profile",
      onlyAdmin: false,
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="html_tag" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("tagsTitle"),
      url: "/tags",
      onlyAdmin: true,
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="user" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("userProfileTitle"),
      url: "/profile",
      onlyAdmin: false,
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="help" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("supportTitle"),
      url: "/help",
      onlyAdmin: false,
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="info" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("aboutMaia"),
      url: "/about",
      onlyAdmin: false,
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="faq" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("faqTitle"),
      url: "/faq",
      onlyAdmin: false,
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="contract" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("termsOfUse"),
      url: "/terms-of-use",
      onlyAdmin: false,
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="logout" fontSize={iconSize} htmlColor={iconColor} />,
      title: t("logoutTitle"),
      handleClick: logoutHandler,
      onlyAdmin: false,
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
    <div
      dir={currentDirection()}
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
      className={classNames("ps-4", classes.list)}
    >
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
      <List component="nav" style={{ width: "100%" }}>
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
        {menuArray
          .filter((item) => {
            if (item.onlyAdmin) {
              return isSubadminProfile();
            }
            return true;
          })
          .map((item: ListItemProps) => {
            const { id, icon, color, title, url, handleClick } = item;
            if (url)
              return (
                <div>
                  <Link key={uuid()} href={url}>
                    {getListItemButton(id, icon, color, title)}
                  </Link>
                </div>
              );

            return (
              <div onClick={handleClick} key={uuid()}>
                {getListItemButton(id, icon, color, title)}
              </div>
            );
          })}
      </List>
      {/* <div style={{ marginLeft: 15, paddingRight: 25, marginTop: 20 }}>
        <SliderQuota />
      </div> */}
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
