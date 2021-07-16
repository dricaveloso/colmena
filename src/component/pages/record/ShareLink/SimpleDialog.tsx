import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import {
  EmailShareButton,
  EmailIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import Divider from "@material-ui/core/Divider";
import BoxItemShare from "./BoxItemShare";

type SimpleDialogProps = {
  onClose: () => void;
  open: boolean;
  url: string;
  titleShareLink: string;
};

function SimpleDialog({ onClose, open, url, titleShareLink }: SimpleDialogProps) {
  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">{titleShareLink}</DialogTitle>
      <div style={{ padding: 10, display: "flex", flexDirection: "column" }}>
        <EmailShareButton url={url} onShareWindowClose={onClose}>
          <BoxItemShare title="E-mail">
            <EmailIcon size={32} round />
          </BoxItemShare>
        </EmailShareButton>
        <Divider />
        <TelegramShareButton url={url} onShareWindowClose={onClose}>
          <BoxItemShare title="Telegram">
            <TelegramIcon size={32} round />
          </BoxItemShare>
        </TelegramShareButton>
        <Divider />
        <WhatsappShareButton url={url} onShareWindowClose={onClose}>
          <BoxItemShare title="Whatsapp">
            <WhatsappIcon size={32} round />
          </BoxItemShare>
        </WhatsappShareButton>
      </div>
    </Dialog>
  );
}

export default SimpleDialog;
