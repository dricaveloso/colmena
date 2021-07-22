import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ListItemIcon, SwipeableDrawer, List, ListItem, ListItemText } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import NotificationContext from "@/store/context/notification-context";
import { NotificationStatusEnum } from "@/enums/index";
import CONSTANTS from "@/constants/index";
import { v4 as uuid } from "uuid";

type ListItemProps = {
  id: number;
  url?: string | undefined;
  icon: string;
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
  title: {
    flexGrow: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  list: {
    width: "60vw",
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
  const classes = useStyles();
  const notificationCtx = useContext(NotificationContext);
  const { t } = useTranslation("drawer");
  const { t: c } = useTranslation("common");
  const menuArray = [
    {
      id: 1,
      icon: "home",
      title: t("homeTitle"),
      url: "/home",
    },
    {
      id: 2,
      icon: "folder",
      title: t("myFilesTitle"),
      url: "/library",
    },
    {
      id: 3,
      icon: "mic",
      title: t("recordTitle"),
      url: "/call",
    },
    {
      id: 4,
      icon: "crop",
      title: t("editAudioTitle"),
      url: "/edit-audio",
    },
    {
      id: 5,
      icon: "edit",
      title: t("editTextTitle"),
      handleClick: () =>
        notificationCtx.showNotification({
          message: c("featureUnavailable"),
          status: NotificationStatusEnum.WARNING,
        }),
    },
    {
      id: 6,
      icon: "group_work",
      title: t("communityTitle"),
      handleClick: () =>
        notificationCtx.showNotification({
          message: c("featureUnavailable"),
          status: NotificationStatusEnum.WARNING,
        }),
    },
    {
      id: 7,
      icon: "settings",
      title: t("editMediaTitle"),
      url: "/media-profile",
    },
    {
      id: 8,
      icon: "person",
      title: t("userProfileTitle"),
      url: "/profile",
    },
    {
      id: 9,
      icon: "info",
      title: t("supportTitle"),
      url: "/talk-to-us",
    },
    {
      id: 10,
      icon: "logout",
      title: t("logoutTitle"),
    },
  ];

  const getListItemButton = (
    id: number,
    icon: string,
    color?: string | undefined,
    title?: string,
  ): React.ReactNode => (
    <ListItem dense divider key={id}>
      <ListItemIcon>
        <MaterialIcon icon={icon} fontSize="small" style={color ? { color } : {}} />
      </ListItemIcon>
      <ListItemText primary={title} />
    </ListItem>
  );

  const drawerMenu = (): React.ReactNode => (
    <div role="presentation" onClick={onClose} onKeyDown={onClose} className={classes.list}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: 20,
          marginTop: 20,
        }}
      >
        <p style={{ fontSize: 20, fontWeight: "bold", margin: 0 }}>{CONSTANTS.APP_NAME}</p>
        <small style={{ color: "gray" }}>version 0.0.1</small>
      </div>
      <List component="nav">
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
    <SwipeableDrawer anchor="left" open={open} onOpen={onOpen} onClose={onClose}>
      {drawerMenu()}
    </SwipeableDrawer>
  );
}

export default Drawer;
