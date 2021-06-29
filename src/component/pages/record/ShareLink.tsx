import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "component/ui/IconButton";
import {
  EmailShareButton,
  EmailIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import Divider from "@material-ui/core/Divider";
import { useTranslation } from "next-i18next";

const BoxItemShare = ({ title, children }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
      }}
    >
      {children}
      <span style={{ marginLeft: 15 }}>{title}</span>
    </div>
  );
};

function SimpleDialog({ onClose, open, url, titleShareLink }) {
  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">{titleShareLink}</DialogTitle>
      <div style={{ padding: 10, display: "flex", flexDirection: "column" }}>
        <EmailShareButton url={url} onShareWindowClose={onClose}>
          <BoxItemShare title="E-mail">
            <EmailIcon size={32} round={true} />
          </BoxItemShare>
        </EmailShareButton>
        <Divider />
        <TelegramShareButton url={url} onShareWindowClose={onClose}>
          <BoxItemShare title="Telegram">
            <TelegramIcon size={32} round={true} />
          </BoxItemShare>
        </TelegramShareButton>
        <Divider />
        <WhatsappShareButton url={url} onShareWindowClose={onClose}>
          <BoxItemShare title="Whatsapp">
            <WhatsappIcon size={32} round={true} />
          </BoxItemShare>
        </WhatsappShareButton>
      </div>
    </Dialog>
  );
}

export default function ShareLink({ url }) {
  const { t } = useTranslation("record");

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div>
        <IconButton
          title={t("textInvite")}
          variantTitle="p"
          icon="person_add"
          fontSizeIcon="1.8em"
          color="black"
          handleClick={handleClickOpen}
        />
      </div>
      <SimpleDialog
        open={open}
        onClose={handleClose}
        titleShareLink={t("titleShareLink")}
        url={url}
      />
    </>
  );
}
