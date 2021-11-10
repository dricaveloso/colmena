import React, { useState, useContext } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { copyFile, deleteFile, moveFile } from "@/services/webdav/files";
import { deleteDirectory } from "@/services/webdav/directories";
import IconButton from "@/components/ui/IconButton";
import { Environment, PropsUserSelector, PropsLibrarySelector } from "@/types/index";
import { EnvironmentEnum, NotificationStatusEnum } from "@/enums/*";
import { useSelector, useDispatch } from "react-redux";
import { removeLibraryFile } from "@/store/actions/library";
import NotificationContext from "@/store/context/notification-context";
import { useTranslation } from "react-i18next";

interface ContextMenuOptionsInterface {
  id: string;
  type?: string | undefined;
  filename: string;
  environment: Environment;
}

const ContextMenuOptions = ({ id, type, filename, environment }: ContextMenuOptionsInterface) => {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation("library");
  const { t: c } = useTranslation("common");
  const dispatch = useDispatch();
  const notificationCtx = useContext(NotificationContext);
  const isRemote = environment === EnvironmentEnum.REMOTE;

  const handleOpenContextMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseContextMenu = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      let deleted = false;
      if (isRemote) {
        deleted = await deleteRemoteItem();
      }

      if (deleted) {
        dispatch(removeLibraryFile(id));
      } else {
        notificationCtx.showNotification({
          message: t("messages.couldNotRemove"),
          status: NotificationStatusEnum.ERROR,
        });
      }

      handleCloseContextMenu();
    } catch (e) {
      console.log(e);
    }
  };

  const deleteRemoteItem = async () => {
    if (type === "directory") {
      return deleteDirectory(userRdx.user.id, filename);
    }

    return deleteFile(userRdx.user.id, filename);
  };

  const unavailable = () => {
    notificationCtx.showNotification({
      message: c("featureUnavailable"),
      status: NotificationStatusEnum.WARNING,
    });
  };

  return (
    <>
      <IconButton
        key="more-options"
        icon="more_vertical"
        color="#9A9A9A"
        style={{ padding: 0, margin: 0, minWidth: 30 }}
        fontSizeIcon="small"
        handleClick={handleOpenContextMenu}
      />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseContextMenu}
      >
        <MenuItem key="delete" onClick={handleDelete}>
          {t("contextMenuOptions.delete")}
        </MenuItem>
        <MenuItem key="edit" onClick={unavailable} style={{ color: "#aaa" }}>
          {t("contextMenuOptions.edit")}
        </MenuItem>
        <MenuItem key="copy" onClick={unavailable} style={{ color: "#aaa" }}>
          {t("contextMenuOptions.copy")}
        </MenuItem>
        <MenuItem key="move" onClick={unavailable} style={{ color: "#aaa" }}>
          {t("contextMenuOptions.move")}
        </MenuItem>
        <MenuItem key="duplicate" onClick={unavailable} style={{ color: "#aaa" }}>
          {t("contextMenuOptions.duplicate")}
        </MenuItem>
        <MenuItem key="download" onClick={unavailable} style={{ color: "#aaa" }}>
          {t("contextMenuOptions.download")}
        </MenuItem>
        <MenuItem key="rename" onClick={unavailable} style={{ color: "#aaa" }}>
          {t("contextMenuOptions.rename")}
        </MenuItem>
        <MenuItem key="details" onClick={unavailable} style={{ color: "#aaa" }}>
          {t("contextMenuOptions.details")}
        </MenuItem>
        <MenuItem key="sync" onClick={unavailable} style={{ color: "#aaa" }}>
          {t("contextMenuOptions.synchronize")}
        </MenuItem>
        <MenuItem key="publish" onClick={unavailable} style={{ color: "#aaa" }}>
          {t("contextMenuOptions.publish")}
        </MenuItem>
      </Menu>
    </>
  );
};

export default ContextMenuOptions;
