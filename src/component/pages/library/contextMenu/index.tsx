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
import CopyItemModal from "./CopyItemModal";
import { LibraryCardItemInterface } from "@/interfaces/index";
import MoveItemModal from "./MoveItemModal";
import DetailsModal from "./DetailsModal";
import { getAudioPath, pathIsInFilename } from "@/utils/directory";
import { remove } from "@/store/idb/models/files";

const ContextMenuOptions = (cardItem: LibraryCardItemInterface) => {
  const { id, type, environment, filename, basename, aliasFilename } = cardItem;
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation("library");
  const { t: c } = useTranslation("common");
  const dispatch = useDispatch();
  const notificationCtx = useContext(NotificationContext);
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [openRenameItemModal, setOpenRenameItemModal] = useState(false);
  const [openDuplicateItemModal, setOpenDuplicateItemModal] = useState(false);
  const [openCopyItemModal, setOpenCopyItemModal] = useState(false);
  const [openMoveItemModal, setOpenMoveItemModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

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

  const handleOpenCopyModal = (opt: boolean) => {
    setOpenCopyItemModal(opt);
    handleCloseContextMenu();
  };

  const handleOpenMoveModal = (opt: boolean) => {
    setOpenMoveItemModal(opt);
    handleCloseContextMenu();
  };

  const handleOpenDetailsModal = (opt: boolean) => {
    setOpenDetailsModal(opt);
    handleCloseContextMenu();
  };

  const handleDelete = async () => {
    try {
      let deleted = false;
      switch (environment) {
        case EnvironmentEnum.REMOTE:
          deleted = await remove(id, userRdx.user.id);
          break;
        case EnvironmentEnum.LOCAL:
          deleted = await deleteRemoteItem();
          break;
        case EnvironmentEnum.BOTH:
          deleted = await deleteRemoteItem();
          if (deleted) {
            deleted = await remove(id, userRdx.user.id);
          }
          break;
        default:
          break;
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

  const insideOfflinePath = pathIsInFilename(getAudioPath(), filename);

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
        {!insideOfflinePath && type === "file" && (
          <MenuItem key="edit" onClick={unavailable} style={{ color: "#aaa" }}>
            {t("contextMenuOptions.edit")}
          </MenuItem>
        )}
        {!insideOfflinePath && (
          <MenuItem key="copy" onClick={() => handleOpenCopyModal(true)}>
            {t("contextMenuOptions.copy")}
          </MenuItem>
        )}
        {!insideOfflinePath && (
          <MenuItem key="move" onClick={() => handleOpenMoveModal(true)}>
            {t("contextMenuOptions.move")}
          </MenuItem>
        )}
        {!insideOfflinePath && (
          <MenuItem key="duplicate" onClick={() => handleOpenDuplicateModal(true)}>
            {t("contextMenuOptions.duplicate")}
          </MenuItem>
        )}
        {!insideOfflinePath && type === "file" && (
          <MenuItem key="download" onClick={() => handleOpenDownloadModal(true)}>
            {t("contextMenuOptions.download")}
          </MenuItem>
        )}
        {!insideOfflinePath && (
          <MenuItem key="rename" onClick={() => handleOpenRenameModal(true)}>
            {t("contextMenuOptions.rename")}
          </MenuItem>
        )}
        {!insideOfflinePath && (
          <MenuItem key="details" onClick={() => handleOpenDetailsModal(true)}>
            {t("contextMenuOptions.details")}
          </MenuItem>
        )}
        {!insideOfflinePath && (
          <MenuItem key="sync" onClick={unavailable} style={{ color: "#aaa" }}>
            {t("contextMenuOptions.synchronize")}
          </MenuItem>
        )}
        {!insideOfflinePath && (
          <MenuItem key="publish" onClick={unavailable} style={{ color: "#aaa" }}>
            {t("contextMenuOptions.publish")}
          </MenuItem>
        )}
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
          aliasFilename={aliasFilename}
          basename={basename}
          type={type ?? "file"}
          environment={environment}
        />
      )}
      {openDuplicateItemModal && (
        <DuplicateItemModal
          key={`${basename}-rename-modal`}
          open={openDuplicateItemModal}
          handleOpen={() => handleOpenDuplicateModal(false)}
          cardItem={cardItem}
        />
      )}
      {openCopyItemModal && (
        <CopyItemModal
          key={`${basename}-copy-modal`}
          open={openCopyItemModal}
          handleOpen={() => handleOpenCopyModal(false)}
          cardItem={cardItem}
        />
      )}
      {openMoveItemModal && (
        <MoveItemModal
          key={`${basename}-move-modal`}
          open={openMoveItemModal}
          handleOpen={() => handleOpenMoveModal(false)}
          cardItem={cardItem}
        />
      )}
      {openDetailsModal && (
        <DetailsModal
          key={`${basename}-details-modal`}
          open={openDetailsModal}
          handleOpen={() => handleOpenDetailsModal(false)}
          cardItem={cardItem}
        />
      )}
    </>
  );
};

export default ContextMenuOptions;
