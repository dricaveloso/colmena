/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import { useTranslation } from "next-i18next";
import NewFolderModal from "./ModalTools/NewFolderModal";
import NewHoneycombModal from "./ModalTools/NewHoneycombModal";
import UploadModal from "./ModalTools/UploadModal";
import Grid from "@material-ui/core/Grid";
import IconButton from "@/components/ui/IconButton";
import theme from "@/styles/theme";
import Box from "@material-ui/core/Box";
import { FontSizeIconProps } from "@/types/index";
import { toast } from "@/utils/notifications";
import { isSubadminProfile } from "@/utils/permissions";
import { ButtonColorEnum, ButtonVariantEnum } from "@/enums/index";
import Button from "@/components/ui/Button";

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
    if (isSubadminProfile()) setOpenNewHoneycombModal(true);
    else toast(t("noPrivilegesAccessTitle"), "error");
  };

  const handleCloseNewHoneycombModal = () => {
    setOpenNewHoneycombModal(false);
    handleClose();
  };
  interface DefaultConfigButtonInterface {
    color: {
      main: string;
      light: string;
    };
    fontSizeIcon: FontSizeIconProps;
    fontSize: number;
  }

  const defaultConfigButton: DefaultConfigButtonInterface = {
    color: {
      main: theme.palette.icon.main,
      light: theme.palette.icon.light,
    },
    fontSizeIcon: "medium",
    fontSize: 12,
  };

  return (
    <>
      <SwipeableDrawer anchor="bottom" open={open} onClose={handleClose} onOpen={handleOpen}>
        <Box padding={2}>
          <Grid container spacing={2}>
            <Grid item xs={3} key={uuid()}>
              <IconButton
                icon="upload"
                iconColor={defaultConfigButton.color.main}
                fontSizeIcon={defaultConfigButton.fontSizeIcon}
                textStyle={{
                  fontSize: defaultConfigButton.fontSize,
                  color: defaultConfigButton.color.main,
                }}
                title={t("uploadFileDrawerBottomTitle")}
                handleClick={handleOpenUploadModal}
              />
            </Grid>
            <Grid item xs={3}>
              <IconButton
                icon="add_folder"
                iconColor={defaultConfigButton.color.main}
                fontSizeIcon={defaultConfigButton.fontSizeIcon}
                textStyle={{
                  fontSize: defaultConfigButton.fontSize,
                  color: defaultConfigButton.color.main,
                }}
                title={t("addFolderDrawerBottomTitle")}
                handleClick={handleOpenNewFolderModal}
              />
            </Grid>
            <Grid item xs={3}>
              <IconButton
                icon="panal_flat"
                iconColor={defaultConfigButton.color.main}
                fontSizeIcon={defaultConfigButton.fontSizeIcon}
                textStyle={{
                  fontSize: defaultConfigButton.fontSize,
                  color: defaultConfigButton.color.main,
                }}
                title={t("addHoneycombDrawerBottomTitle")}
                handleClick={handleOpenNewHoneycombModal}
              />
            </Grid>
            <Grid item xs={3}>
              <IconButton
                icon="edit_text"
                iconColor={defaultConfigButton.color.light}
                fontSizeIcon={defaultConfigButton.fontSizeIcon}
                textStyle={{
                  fontSize: defaultConfigButton.fontSize,
                  color: defaultConfigButton.color.light,
                }}
                title={t("textDrawerBottomTitle")}
                handleClick={() => toast(t("featureUnavailable"), "warning")}
              />
            </Grid>
            <Grid item xs={3}>
              <IconButton
                icon="headphone"
                iconColor={defaultConfigButton.color.light}
                fontSizeIcon={defaultConfigButton.fontSizeIcon}
                textStyle={{
                  fontSize: defaultConfigButton.fontSize,
                  color: defaultConfigButton.color.light,
                }}
                title={t("callDrawerBottomTitle")}
                handleClick={() => navigate("/call")}
              />
            </Grid>
            <Grid item xs={3} key={uuid()}>
              <IconButton
                icon="microphone"
                iconColor={defaultConfigButton.color.main}
                fontSizeIcon={defaultConfigButton.fontSizeIcon}
                textStyle={{
                  fontSize: defaultConfigButton.fontSize,
                  color: defaultConfigButton.color.main,
                }}
                title={t("recordingDrawerBottomTitle")}
                handleClick={() => navigate("/recording")}
              />
            </Grid>
            <Grid item xs={3} key={uuid()}>
              <IconButton
                icon="stream"
                iconColor={defaultConfigButton.color.light}
                fontSizeIcon={defaultConfigButton.fontSizeIcon}
                textStyle={{
                  fontSize: defaultConfigButton.fontSize,
                  color: defaultConfigButton.color.light,
                }}
                title={t("streamDrawerBottomTitle")}
                handleClick={() => toast(t("featureUnavailable"), "warning")}
              />
            </Grid>
            <Grid item xs={3} key={uuid()}>
              <IconButton
                icon="audio_editor"
                iconColor={defaultConfigButton.color.light}
                fontSizeIcon={defaultConfigButton.fontSizeIcon}
                textStyle={{
                  fontSize: defaultConfigButton.fontSize,
                  color: defaultConfigButton.color.light,
                }}
                title={t("audioEditorDrawerBottomTitle")}
                handleClick={() => toast(t("featureUnavailable"), "warning")}
              />
            </Grid>
          </Grid>
        </Box>
        <Box margin={1}>
          <Button
            title={t("form.cancelButton")}
            handleClick={handleClose}
            variant={ButtonVariantEnum.TEXT}
            color={ButtonColorEnum.DEFAULT}
            fullWidth
          />
        </Box>
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
