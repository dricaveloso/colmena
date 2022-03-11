import React, { useState } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@/components/ui/IconButton";
import { useTranslation } from "react-i18next";
import DownloadModal from "./DownloadModal";
import RenameItemModal from "./RenameItemModal";
import DuplicateItemModal from "./DuplicateItemModal";
import CopyItemModal from "./CopyItemModal";
import { getOnlyFilename, isAudioFile } from "@/utils/utils";
import { LibraryItemContextMenuInterface } from "@/interfaces/index";
import MoveItemModal from "./MoveItemModal";
import DetailsModal from "./DetailsModal";
import DeleteItemConfirm from "./DeleteItemConfirm";
import SyncModal from "./SyncModal";
import { toast } from "@/utils/notifications";
import { ContextMenuOptionEnum, EnvironmentEnum } from "@/enums/*";
import Switch from "@material-ui/core/Switch";
import { Box } from "@material-ui/core";
import ContextMenuItem from "@/components/ui/ContextMenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useRouter } from "next/router";
// import { removeCornerSlash } from "@/utils/utils";
const ContextMenuOptions = (cardItem: LibraryItemContextMenuInterface) => {
  const {
    type,
    environment,
    filename,
    basename,
    arrayBufferBlob,
    extension,
    mime,
    availableOptions,
  } = cardItem;

  if (!availableOptions || availableOptions.length === 0) {
    return null;
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation("library");
  const { t: c } = useTranslation("common");
  const router = useRouter();
  const [openCopyItemModal, setOpenCopyItemModal] = useState(false);
  const [availableOffline, setAvailableOffline] = useState(environment === EnvironmentEnum.BOTH);
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [openSyncModal, setOpenSyncModal] = useState(false);
  const [openRenameItemModal, setOpenRenameItemModal] = useState(false);
  const [openDuplicateItemModal, setOpenDuplicateItemModal] = useState(false);
  const [openMoveItemModal, setOpenMoveItemModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openDeleteItemConfirm, setOpenDeleteItemConfirm] = useState(false);

  const handleOpenContextMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseContextMenu = () => {
    setAnchorEl(null);
  };

  const goToTextEditor = () => {
    const filename = getOnlyFilename(cardItem.basename);
    router.push(`text-editor/${filename}`);
  };

  const unavailable = () => {
    toast(c("featureUnavailable"), "warning");
  };

  const openEditFilePage = () => {
    if (isAudioFile(mime)) {
      router.push(`/edit-audio/${btoa(filename)}`);
      return;
    }

    unavailable();
  };

  // const inLibraryPage = useMemo(() => {
  //   const splitPage = removeCornerSlash(router.route).split("/");

  //   return splitPage[0] === "library";
  // }, [router.route]);

  const renderModals = [];
  const renderOptions = [];
  if (
    type === "file" &&
    availableOptions.includes(ContextMenuOptionEnum.EDIT) &&
    extension !== "md"
  ) {
    renderOptions.push(
      <MenuItem key="edit" onClick={openEditFilePage} data-testid="edit-item">
        <ContextMenuItem title={t("contextMenuOptions.edit")} icon="edit_filled" />
      </MenuItem>,
    );
  }

  if (extension === "md") {
    renderOptions.push(
      <MenuItem
        key="edit"
        onClick={goToTextEditor}
        data-testid="edit-item"
        style={{ color: "#aaa" }}
      >
        <ContextMenuItem title={t("contextMenuOptions.edit")} icon="edit_filled" />
      </MenuItem>,
    );
  }

  if (availableOptions.includes(ContextMenuOptionEnum.COPY)) {
    const handleOpenCopyModal = (opt: boolean) => {
      setOpenCopyItemModal(opt);
      handleCloseContextMenu();
    };

    if (openCopyItemModal) {
      renderModals.push(
        <CopyItemModal
          key={`${basename}-copy-modal`}
          open={openCopyItemModal}
          handleOpen={() => handleOpenCopyModal(false)}
          cardItem={cardItem}
        />,
      );
    }

    renderOptions.push(
      <MenuItem key="copy" data-testid="copy-item" onClick={() => handleOpenCopyModal(true)}>
        <ContextMenuItem title={t("contextMenuOptions.copy")} icon="copy" />
      </MenuItem>,
    );
  }

  if (availableOptions.includes(ContextMenuOptionEnum.MOVE)) {
    const handleOpenMoveModal = (opt: boolean) => {
      setOpenMoveItemModal(opt);
      handleCloseContextMenu();
    };

    if (openMoveItemModal) {
      renderModals.push(
        <MoveItemModal
          key={`${basename}-move-modal`}
          open={openMoveItemModal}
          handleOpen={() => handleOpenMoveModal(false)}
          cardItem={cardItem}
        />,
      );
    }

    renderOptions.push(
      <MenuItem key="move" data-testid="move-item" onClick={() => handleOpenMoveModal(true)}>
        <ContextMenuItem title={t("contextMenuOptions.move")} icon="move" />
      </MenuItem>,
    );
  }

  if (availableOptions.includes(ContextMenuOptionEnum.DUPLICATE)) {
    const handleOpenDuplicateModal = (opt: boolean) => {
      setOpenDuplicateItemModal(opt);
      handleCloseContextMenu();
    };

    if (openDuplicateItemModal) {
      renderModals.push(
        <DuplicateItemModal
          key={`${basename}-duplicate-modal`}
          open={openDuplicateItemModal}
          handleOpen={() => handleOpenDuplicateModal(false)}
          cardItem={cardItem}
        />,
      );
    }

    renderOptions.push(
      <MenuItem
        key="duplicate"
        data-testid="duplicate-item"
        onClick={() => handleOpenDuplicateModal(true)}
      >
        <ContextMenuItem title={t("contextMenuOptions.duplicate")} icon="duplicate" />
      </MenuItem>,
    );
  }

  if (availableOptions.includes(ContextMenuOptionEnum.DOWNLOAD) && type === "file") {
    const handleOpenDownloadModal = (opt: boolean) => {
      setOpenDownloadModal(opt);
      handleCloseContextMenu();
    };

    renderModals.push(
      <DownloadModal
        key={`${basename}-download-modal`}
        open={openDownloadModal}
        handleOpen={() => handleOpenDownloadModal(false)}
        filename={filename}
        basename={basename}
        mime={mime}
        arrayBufferBlob={arrayBufferBlob}
      />,
    );

    renderOptions.push(
      <MenuItem
        key="download"
        data-testid="download-item"
        onClick={() => handleOpenDownloadModal(true)}
      >
        <ContextMenuItem title={t("contextMenuOptions.download")} icon="download" />
      </MenuItem>,
    );
  }

  if (availableOptions.includes(ContextMenuOptionEnum.RENAME)) {
    const handleOpenRenameModal = (opt: boolean) => {
      setOpenRenameItemModal(opt);
      handleCloseContextMenu();
    };

    if (openRenameItemModal) {
      renderModals.push(
        <RenameItemModal
          key={`${basename}-rename-modal`}
          cardItem={cardItem}
          open={openRenameItemModal}
          handleOpen={() => handleOpenRenameModal(false)}
        />,
      );
    }

    renderOptions.push(
      <MenuItem key="rename" data-testid="rename-item" onClick={() => handleOpenRenameModal(true)}>
        <ContextMenuItem title={t("contextMenuOptions.rename")} icon="rename" />
      </MenuItem>,
    );
  }

  if (availableOptions.includes(ContextMenuOptionEnum.DETAILS)) {
    const handleOpenDetailsModal = (opt: boolean) => {
      setOpenDetailsModal(opt);
      handleCloseContextMenu();
    };

    if (openDetailsModal) {
      renderModals.push(
        <DetailsModal
          key={`${basename}-details-modal`}
          open={openDetailsModal}
          handleOpen={() => handleOpenDetailsModal(false)}
          cardItem={cardItem}
        />,
      );
    }

    renderOptions.push(
      <MenuItem
        key="details"
        data-testid="details-item"
        onClick={() => handleOpenDetailsModal(true)}
      >
        <ContextMenuItem title={t("contextMenuOptions.details")} icon="details" />
      </MenuItem>,
    );
  }

  if (availableOptions.includes(ContextMenuOptionEnum.AVAILABLE_OFFLINE)) {
    const handleOpenSyncModal = (opt: boolean) => {
      setOpenSyncModal(opt);
      handleCloseContextMenu();
    };

    const handleAvailableOffline = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAvailableOffline(event.target.checked);
      handleOpenSyncModal(true);
    };

    if (type === "file" && environment !== EnvironmentEnum.LOCAL) {
      if (openSyncModal) {
        renderModals.push(
          <SyncModal
            availableOffline={availableOffline}
            key={`${basename}-sync-modal`}
            open={openSyncModal}
            handleOpen={() => handleOpenSyncModal(false)}
            cardItem={cardItem}
          />,
        );
      }

      renderOptions.push(
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
        </MenuItem>,
      );
    }
  }

  if (availableOptions.includes(ContextMenuOptionEnum.PUBLISH)) {
    renderOptions.push(
      <MenuItem
        key="publish"
        data-testid="publish-item"
        onClick={() => goToTextEditor()}
        style={{ color: "#aaa" }}
      >
        <ContextMenuItem title={t("contextMenuOptions.publish")} icon="upload" />
      </MenuItem>,
    );
  }

  if (availableOptions.includes(ContextMenuOptionEnum.DELETE)) {
    const handleOpenDeleteItemConfirm = (opt: boolean) => {
      setOpenDeleteItemConfirm(opt);
      handleCloseContextMenu();
    };

    if (openDeleteItemConfirm) {
      renderModals.push(
        <DeleteItemConfirm
          key={`${basename}-delete-confirm`}
          handleOpen={() => handleOpenDeleteItemConfirm(false)}
          cardItem={cardItem}
        />,
      );
    }

    renderOptions.push(
      <MenuItem
        key="delete"
        data-testid="delete-item"
        onClick={() => handleOpenDeleteItemConfirm(true)}
      >
        <ContextMenuItem title={t("contextMenuOptions.delete")} icon="trash" iconColor="tomato" />
      </MenuItem>,
    );
  }

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
        {renderOptions}
      </Menu>

      {renderModals}
    </>
  );
};

export default ContextMenuOptions;
