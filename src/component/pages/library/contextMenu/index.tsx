import React, { useState, useContext } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { deleteFile } from "@/services/webdav/files";
import { deleteDirectory } from "@/services/webdav/directories";
import IconButton from "@/components/ui/IconButton";
import { PropsUserSelector } from "@/types/index";
import { EnvironmentEnum, NotificationStatusEnum } from "@/enums/*";
import { useSelector, useDispatch } from "react-redux";
import { removeLibraryFile } from "@/store/actions/library";
import NotificationContext from "@/store/context/notification-context";
import { useTranslation } from "react-i18next";
import DownloadModal from "./DownloadModal";
import RenameItemModal from "./RenameItemModal";
import DuplicateItemModal from "./DuplicateItemModal";
import { LibraryCardItemInterface } from "@/interfaces/index";

const ContextMenuOptions = (cardItem: LibraryCardItemInterface) => {
  const { id, type, environment } = cardItem;
  // eslint-disable-next-line react/destructuring-assignment
  const filename: string = cardItem.filename ?? "";
  // eslint-disable-next-line react/destructuring-assignment
  const basename: string = cardItem.basename ?? "";
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation("library");
  const { t: c } = useTranslation("common");
  const dispatch = useDispatch();
  const notificationCtx = useContext(NotificationContext);
  const isRemote = environment === EnvironmentEnum.REMOTE;
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [openRenameItemModal, setOpenRenameItemModal] = useState(false);
  const [openDuplicateItemModal, setOpenDuplicateItemModal] = useState(false);

  const handleOpenContextMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseContextMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenDownloadModal = (opt: boolean) => {
    setOpenDownloadModal(opt);
    handleCloseContextMenu();
  };

  const handleOpenRenameModal = (opt: boolean) => {
    setOpenRenameItemModal(opt);
    handleCloseContextMenu();
  };

  const handleOpenDuplicateModal = (opt: boolean) => {
    setOpenDuplicateItemModal(opt);
    handleCloseContextMenu();
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
        key={`${basename}-more-options`}
        icon="more_vertical"
        color="#9A9A9A"
        style={{ padding: 0, margin: 0, minWidth: 30 }}
        fontSizeIcon="small"
        handleClick={handleOpenContextMenu}
      />
      <Menu
        key={`${basename}-options`}
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseContextMenu}
      >
        {type === "file" && (
          <MenuItem key="edit" onClick={unavailable} style={{ color: "#aaa" }}>
            {t("contextMenuOptions.edit")}
          </MenuItem>
        )}
        <MenuItem key="copy" onClick={unavailable} style={{ color: "#aaa" }}>
          {t("contextMenuOptions.copy")}
        </MenuItem>
        <MenuItem key="move" onClick={unavailable} style={{ color: "#aaa" }}>
          {t("contextMenuOptions.move")}
        </MenuItem>
        <MenuItem key="duplicate" onClick={() => handleOpenDuplicateModal(true)}>
          {t("contextMenuOptions.duplicate")}
        </MenuItem>
        {type === "file" && (
          <MenuItem key="download" onClick={() => handleOpenDownloadModal(true)}>
            {t("contextMenuOptions.download")}
          </MenuItem>
        )}
        <MenuItem key="rename" onClick={() => handleOpenRenameModal(true)}>
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
        <MenuItem key="delete" onClick={handleDelete}>
          {t("contextMenuOptions.delete")}
        </MenuItem>
      </Menu>
      <DownloadModal
        key={`${basename}-download-modal`}
        open={openDownloadModal}
        handleOpen={() => handleOpenDownloadModal(false)}
        filename={filename}
        basename={basename}
      />
      {openRenameItemModal && (
        <RenameItemModal
          key={`${basename}-rename-modal`}
          id={id}
          open={openRenameItemModal}
          handleOpen={() => handleOpenRenameModal(false)}
          filename={filename}
          basename={basename}
          type={type ?? "file"}
        />
      )}
      {openDuplicateItemModal && (
        <DuplicateItemModal
          key={`${basename}-rename-modal`}
          open={openDuplicateItemModal}
          handleOpen={() => handleOpenDuplicateModal(false)}
          cardItem={{ ...cardItem }}
        />
      )}
    </>
  );
};

export default ContextMenuOptions;
