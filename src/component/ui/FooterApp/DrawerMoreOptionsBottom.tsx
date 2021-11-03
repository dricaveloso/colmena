import React, { useState, useContext } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import { useTranslation } from "next-i18next";
import NewFolderModal from "./ModalTools/NewFolderModal";
import NewHoneycombModal from "./ModalTools/NewHoneycombModal";
import Grid from "@material-ui/core/Grid";
import IconButton from "@/components/ui/IconButton";
import theme from "@/styles/theme";
import Box from "@material-ui/core/Box";
import { FontSizeIconProps } from "@/types/index";
import NotificationContext from "@/store/context/notification-context";
import { NotificationStatusEnum } from "@/enums/index";

type Props = {
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
};

export default function SwipeableTemporaryDrawer({ open, handleOpen, handleClose }: Props) {
  const [openNewFolderModal, setOpenNewFolderModal] = useState(false);
  const [openNewHoneycombModal, setOpenNewHoneycombModal] = useState(false);
  const notificationCtx = useContext(NotificationContext);

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

  const handleOpenNewHoneycombModal = () => {
    setOpenNewHoneycombModal(true);
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
                iconColor={defaultConfigButton.color.light}
                fontSizeIcon={defaultConfigButton.fontSizeIcon}
                textStyle={{
                  fontSize: defaultConfigButton.fontSize,
                  color: defaultConfigButton.color.light,
                }}
                title={t("uploadDrawerBottomTitle")}
                handleClick={() =>
                  notificationCtx.showNotification({
                    message: t("featureUnavailable"),
                    status: NotificationStatusEnum.WARNING,
                  })
                }
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
                handleClick={() =>
                  notificationCtx.showNotification({
                    message: t("featureUnavailable"),
                    status: NotificationStatusEnum.WARNING,
                  })
                }
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
                handleClick={() =>
                  notificationCtx.showNotification({
                    message: t("featureUnavailable"),
                    status: NotificationStatusEnum.WARNING,
                  })
                }
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
                handleClick={() =>
                  notificationCtx.showNotification({
                    message: t("featureUnavailable"),
                    status: NotificationStatusEnum.WARNING,
                  })
                }
              />
            </Grid>
          </Grid>
        </Box>
      </SwipeableDrawer>
      <NewFolderModal open={openNewFolderModal} handleClose={handleCloseNewFolderModal} />
      <NewHoneycombModal open={openNewHoneycombModal} handleClose={handleCloseNewHoneycombModal} />
    </>
  );
}
