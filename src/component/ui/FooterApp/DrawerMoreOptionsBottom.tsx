import React, { useState } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import SvgIcon from "@/components/ui/SvgIcon";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import { useTranslation } from "next-i18next";
import NewFolderModal from "./ModalTools/NewFolderModal";
import NewHoneycombModal from "./ModalTools/NewHoneycombModal";
import UploadModal from "./ModalTools/UploadModal";

type Props = {
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
};

export default function SwipeableTemporaryDrawer({ open, handleOpen, handleClose }: Props) {
  const [openNewFolderModal, setOpenNewFolderModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openNewHoneycombModal, setOpenNewHoneycombModal] = useState(false);
  const { t } = useTranslation("common");
  const router = useRouter();
  const navigate = (page: string) => {
    router.push(page);
  };

  const handleOpenNewFolderModal = () => {
    setOpenNewFolderModal(true);
    handleClose();
  };

  const handleCloseNewFolderModal = () => {
    setOpenNewFolderModal(false);
  };

  const handleOpenUploadModal = () => {
    setOpenUploadModal(true);
    handleClose();
  };

  const handleCloseUploadModal = () => {
    setOpenUploadModal(false);
  };

  const handleOpenNewHoneycombModal = () => {
    setOpenNewHoneycombModal(true);
  };

  const handleCloseNewHoneycombModal = () => {
    setOpenNewHoneycombModal(false);
    handleClose();
  };

  return (
    <>
      <SwipeableDrawer anchor="bottom" open={open} onClose={handleClose} onOpen={handleOpen}>
        <List>
          <ListItem button key={uuid()}>
            <ListItemText
              primary={t("chooseAnOption")}
              primaryTypographyProps={{ style: { fontWeight: "bold" } }}
              style={{ fontWeight: "bold" }}
            />
          </ListItem>
          <ListItem button key={uuid()} onClick={() => navigate("/recording")}>
            <ListItemAvatar>
              <SvgIcon icon="record" htmlColor="tomato" fontSize="small" />
            </ListItemAvatar>
            <ListItemText primary={t("recordingDrawerBottomTitle")} />
          </ListItem>
          <ListItem button key={uuid()} onClick={() => navigate("/call")}>
            <ListItemAvatar>
              <SvgIcon icon="microphone" fontSize="small" />
            </ListItemAvatar>
            <ListItemText primary={t("callDrawerBottomTitle")} />
          </ListItem>
          <ListItem button key={uuid()} onClick={handleOpenNewFolderModal}>
            <ListItemAvatar>
              <SvgIcon icon="add_folder" fontSize="small" />
            </ListItemAvatar>
            <ListItemText primary={t("addFolderDrawerBottomTitle")} />
          </ListItem>
          <ListItem button key={uuid()} onClick={handleOpenUploadModal}>
            <ListItemAvatar>
              <SvgIcon icon="clould_upload" fontSize="medium" />
            </ListItemAvatar>
            <ListItemText primary={t("uploadFileDrawerBottomTitle")} />
          </ListItem>
          <ListItem button key={uuid()} onClick={handleOpenNewHoneycombModal}>
            <ListItemAvatar>
              <SvgIcon icon="panal_flat" fontSize="small" />
            </ListItemAvatar>
            <ListItemText primary={t("addHoneycombDrawerBottomTitle")} />
          </ListItem>
        </List>
      </SwipeableDrawer>

      {openUploadModal && (
        <UploadModal open={openUploadModal} handleClose={handleCloseUploadModal} />
      )}

      {openNewFolderModal && (
        <NewFolderModal open={openNewFolderModal} handleClose={handleCloseNewFolderModal} />
      )}
      {openNewHoneycombModal && (
        <NewHoneycombModal
          open={openNewHoneycombModal}
          handleClose={handleCloseNewHoneycombModal}
        />
      )}
    </>
  );
}
