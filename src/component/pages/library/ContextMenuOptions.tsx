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

interface ContextMenuOptionsInterface {
  id: string;
  type?: string | undefined;
  filename: string;
  environment: Environment;
}

const ContextMenuOptions = ({ id, type, filename, environment }: ContextMenuOptionsInterface) => {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
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
          message: "Não foi possível remover",
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
        <MenuItem onClick={handleCloseContextMenu}>Edit</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Copy</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Move</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Duplicate</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Download</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Rename</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Details</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Synchronize</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Publish</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
};

export default ContextMenuOptions;
