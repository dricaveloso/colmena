import React from "react";
import Modal from "@/components/ui/Modal";
import { useTranslation } from "next-i18next";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  EmailShareButton,
  EmailIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import { Box } from "@material-ui/core";
import Text from "@/components/ui/Text";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
    },
    media: {
      display: "flex",
      flexDirection: "row",
      padding: "6px 4px!important",
    },
    mediaIcon: {
      //
    },
    mediaTitle: {
      flexGrow: 1,
      textAlign: "left",
      padding: "5px 10px",
    },
  }),
);
type Props = {
  open: boolean;
  handleClose: () => void;
  link: string;
};

export default function ModalShareLink({ open, handleClose, link }: Props) {
  const classes = useStyles();
  const { t } = useTranslation("honeycomb");
  return (
    <Modal
      data-testid="modal-share-link"
      title={t("shareLinkTitle")}
      open={open}
      handleClose={handleClose}
    >
      <Box className={classes.root}>
        <EmailShareButton url={link} onShareWindowClose={handleClose} className={classes.media}>
          <Box className={classes.mediaIcon}>
            <EmailIcon size={32} round />
          </Box>
          <Box className={classes.mediaTitle}>
            <Text>E-mail</Text>
          </Box>
        </EmailShareButton>
        <TelegramShareButton url={link} onShareWindowClose={handleClose} className={classes.media}>
          <Box className={classes.mediaIcon}>
            <TelegramIcon size={32} round />
          </Box>
          <Box className={classes.mediaTitle}>
            <Text>Telegram</Text>
          </Box>
        </TelegramShareButton>
        <WhatsappShareButton url={link} onShareWindowClose={handleClose} className={classes.media}>
          <Box className={classes.mediaIcon}>
            <WhatsappIcon size={32} round />
          </Box>
          <Box className={classes.mediaTitle}>
            <Text>Telegram</Text>
          </Box>
        </WhatsappShareButton>
      </Box>
    </Modal>
  );
}
