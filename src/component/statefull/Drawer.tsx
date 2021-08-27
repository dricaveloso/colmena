import React, { useContext, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { ListItemIcon, SwipeableDrawer, List, ListItem, ListItemText } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import NotificationContext from "@/store/context/notification-context";
import { NotificationStatusEnum, TextVariantEnum } from "@/enums/index";
import Divider from "@material-ui/core/Divider";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/router";
import { signOut } from "next-auth/client";
import Backdrop from "@/components/ui/Backdrop";
import Image from "next/image";
import Text from "@/components/ui/Text";
import SvgIcon from "@/components/ui/SvgIcon";
import SwitchLanguageModal from "@/components/pages/profile/SwitchLanguageModal";
import { parseCookies } from "nookies";

type ListItemProps = {
  id: string;
  url?: string | undefined;
  icon: any;
  color?: string | undefined;
  title?: string;
  handleClick?: () => void | undefined;
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
  list: {
    [theme.breakpoints.down("sm")]: {
      width: "80vw",
    },
    [theme.breakpoints.up("sm")]: {
      width: "40vw",
    },
  },
  fullList: {
    width: "auto",
  },
}));

type Props = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

function Drawer({ open, onOpen, onClose }: Props) {
  const theme = useTheme();
  const classes = useStyles();
  const router = useRouter();
  const notificationCtx = useContext(NotificationContext);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const cookies = parseCookies();
  const [openChangeLanguage, setOpenChangeLanguage] = useState(false);

  const switchLanguageHandle = () => {
    setOpenChangeLanguage(true);
  };

  const handleCloseChangeLanguage = () => {
    setOpenChangeLanguage(false);
  };

  const { t } = useTranslation("drawer");
  const { t: c } = useTranslation("common");

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

  const menuArray = [
    {
      id: uuid(),
      icon: <SvgIcon icon="download_circle" fontSize="large" htmlColor="white" />,
      title: t("downloadTitle"),
      handleClick: () =>
        notificationCtx.showNotification({
          message: c("featureUnavailable"),
          status: NotificationStatusEnum.WARNING,
        }),
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="language" fontSize="large" htmlColor="white" />,
      title: t("languageTitle"),
      handleClick: switchLanguageHandle,
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="settings" fontSize="large" htmlColor="white" />,
      title: t("settingsTitle"),
      handleClick: () =>
        notificationCtx.showNotification({
          message: c("featureUnavailable"),
          status: NotificationStatusEnum.WARNING,
        }),
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="user" fontSize="large" htmlColor="white" />,
      title: t("userProfileTitle"),
      url: "/profile",
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="user_group" fontSize="large" htmlColor="white" />,
      title: t("editMediaTitle"),
      url: "/media-profile",
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="help" fontSize="large" htmlColor="white" />,
      title: t("supportTitle"),
      url: "/talk-to-us",
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="contract" fontSize="large" htmlColor="white" />,
      title: t("termsOfUse"),
      url: "/terms-of-use",
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="info" fontSize="large" htmlColor="white" />,
      title: t("aboutMaia"),
      url: "/about",
    },
    {
      id: uuid(),
      icon: <SvgIcon icon="logout" fontSize="large" htmlColor="white" />,
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
    <ListItem key={id} className={classes.margin}>
      <ListItemIcon>
        {icon}
        {/* <SvgIcon icon={icon} fontSize="large" htmlColor="white" /> */}
      </ListItemIcon>
      <ListItemText primary={title} primaryTypographyProps={{ style: { fontSize: 16 } }} />
    </ListItem>
  );

  const drawerMenu = (): React.ReactNode => (
    <div
      role="presentation"
      style={{ backgroundColor: theme.palette.secondary.main }}
      onClick={onClose}
      onKeyDown={onClose}
      className={classes.list}
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
        <Image src="/images/logo.png" width={90} height={90} alt="Colmena logo" />
        <Text
          style={{ color: "white", fontWeight: "bold", marginLeft: 5, marginRight: 5 }}
          variant={TextVariantEnum.H3}
        >
          COLMENA.
          <br />
          MEDIA
        </Text>
      </div>
      <Divider light style={{ backgroundColor: "white", marginTop: 8 }} />
      <List component="nav" style={{ color: "white" }}>
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
    </div>
  );

  return (
    <div>
      <SwitchLanguageModal
        defaultLang={cookies.NEXT_LOCALE}
        open={openChangeLanguage}
        onClose={handleCloseChangeLanguage}
        backUrl={router.pathname}
      />
      <Backdrop open={showBackdrop} />
      <SwipeableDrawer anchor="left" open={open} onOpen={onOpen} onClose={onClose}>
        <div style={{ flex: 1, backgroundColor: theme.palette.secondary.main }}>{drawerMenu()}</div>
      </SwipeableDrawer>
    </div>
  );
}

export default Drawer;
