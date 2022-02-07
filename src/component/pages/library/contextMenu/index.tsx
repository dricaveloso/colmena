import React, { useState, useMemo } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@/components/ui/IconButton";
import { useTranslation } from "react-i18next";
import DownloadModal from "./DownloadModal";
import RenameItemModal from "./RenameItemModal";
import DuplicateItemModal from "./DuplicateItemModal";
import CopyItemModal from "./CopyItemModal";
import { LibraryCardItemInterface } from "@/interfaces/index";
import MoveItemModal from "./MoveItemModal";
import DetailsModal from "./DetailsModal";
import DeleteItemConfirm from "./DeleteItemConfirm";
import SyncModal from "./SyncModal";
import { toast } from "@/utils/notifications";
import { EnvironmentEnum } from "@/enums/*";
import Switch from "@material-ui/core/Switch";
import { Box } from "@material-ui/core";
import ContextMenuItem from "@/components/ui/ContextMenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useRouter } from "next/router";
import { removeCornerSlash } from "@/utils/utils";

const ContextMenuOptions = (cardItem: LibraryCardItemInterface) => {
  const { id, type, environment, filename, basename, aliasFilename, arrayBufferBlob, mime } =
    cardItem;
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation("library");
  const { t: c } = useTranslation("common");
  const [availableOffline, setAvailableOffline] = useState(environment === EnvironmentEnum.BOTH);
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [openSyncModal, setOpenSyncModal] = useState(false);
  const [openRenameItemModal, setOpenRenameItemModal] = useState(false);
  const [openDuplicateItemModal, setOpenDuplicateItemModal] = useState(false);
  const [openCopyItemModal, setOpenCopyItemModal] = useState(false);
  const [openMoveItemModal, setOpenMoveItemModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openDeleteItemConfirm, setOpenDeleteItemConfirm] = useState(false);
  const router = useRouter();

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

  const handleOpenDeleteItemConfirm = (opt: boolean) => {
    setOpenDeleteItemConfirm(opt);
    handleCloseContextMenu();
  };

  const unavailable = () => {
    toast(c("featureUnavailable"), "warning");
  };

  const handleOpenSyncModal = (opt: boolean) => {
    setOpenSyncModal(opt);
    handleCloseContextMenu();
  };

  const handleAvailableOffline = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvailableOffline(event.target.checked);
    handleOpenSyncModal(true);
  };

  const inLibraryPage = useMemo(() => {
    const splitPage = removeCornerSlash(router.route).split("/");

    return splitPage[0] === "library";
  }, [router.route]);

  return (
    <>
      <IconButton
        data-testid="library-context-menu"
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
          <MenuItem
            key="edit"
            onClick={unavailable}
            data-testid="edit-item"
            style={{ color: "#aaa" }}
          >
            <ContextMenuItem title={t("contextMenuOptions.edit")} icon="edit_filled" />
          </MenuItem>
        )}
        <MenuItem key="copy" data-testid="copy-item" onClick={() => handleOpenCopyModal(true)}>
          <ContextMenuItem title={t("contextMenuOptions.copy")} icon="copy" />
        </MenuItem>
        <MenuItem key="move" data-testid="move-item" onClick={() => handleOpenMoveModal(true)}>
          <ContextMenuItem title={t("contextMenuOptions.move")} icon="move" />
        </MenuItem>
        <MenuItem
          key="duplicate"
          data-testid="duplicate-item"
          onClick={() => handleOpenDuplicateModal(true)}
        >
          <ContextMenuItem title={t("contextMenuOptions.duplicate")} icon="duplicate" />
        </MenuItem>
        {type === "file" && (
          <MenuItem
            key="download"
            data-testid="download-item"
            onClick={() => handleOpenDownloadModal(true)}
          >
            <ContextMenuItem title={t("contextMenuOptions.download")} icon="download" />
          </MenuItem>
        )}
        {inLibraryPage && type === "file" && environment !== EnvironmentEnum.LOCAL && (
          <MenuItem key="sync" data-testid="sync-item">
            <Box display="flex" justifyContent="flex-start">
              <FormControlLabel
                style={{ paddingLeft: 0, marginLeft: 0 }}
                labelPlacement="start"
                control={<Switch checked={availableOffline} onChange={handleAvailableOffline} />}
                label={
                  <ContextMenuItem title={t("contextMenuOptions.availableOffline")} icon="sync" />
                }
              />
            </Box>
          </MenuItem>
        )}
        <MenuItem
          key="rename"
          data-testid="rename-item"
          onClick={() => handleOpenRenameModal(true)}
        >
          <ContextMenuItem title={t("contextMenuOptions.rename")} icon="rename" />
        </MenuItem>
        <MenuItem
          key="details"
          data-testid="details-item"
          onClick={() => handleOpenDetailsModal(true)}
        >
          <ContextMenuItem title={t("contextMenuOptions.details")} icon="details" />
        </MenuItem>
        <MenuItem
          key="publish"
          data-testid="publish-item"
          onClick={unavailable}
          style={{ color: "#aaa" }}
        >
          <ContextMenuItem title={t("contextMenuOptions.publish")} icon="upload" />
        </MenuItem>
        <MenuItem
          key="delete"
          data-testid="delete-item"
          onClick={() => handleOpenDeleteItemConfirm(true)}
        >
          <ContextMenuItem title={t("contextMenuOptions.delete")} icon="trash" iconColor="tomato" />
        </MenuItem>
      </Menu>
      <DownloadModal
        key={`${basename}-download-modal`}
        open={openDownloadModal}
        handleOpen={() => handleOpenDownloadModal(false)}
        filename={filename}
        basename={basename}
        mime={mime}
        arrayBufferBlob={arrayBufferBlob}
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

      {openDeleteItemConfirm && (
        <DeleteItemConfirm
          key={`${basename}-delete-confirm`}
          handleOpen={() => handleOpenDeleteItemConfirm(false)}
          cardItem={cardItem}
        />
      )}

      {openSyncModal && inLibraryPage && (
        <SyncModal
          availableOffline={availableOffline}
          key={`${basename}-sync-modal`}
          open={openSyncModal}
          handleOpen={() => handleOpenDownloadModal(false)}
          cardItem={cardItem}
        />
      )}
    </>
  );
};

export default ContextMenuOptions;
