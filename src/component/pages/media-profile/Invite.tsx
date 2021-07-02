import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import Select from "component/ui/Select";
import { useTranslation } from "next-i18next";
import NotificationContext from "store/notification-context";
import { SelectVariantEnum, NotificationStatusEnum } from "enums";

type Props = {
  openInviteForm: boolean;
  handleCloseInviteForm: () => void;
};

export default function InviteForm({ openInviteForm, handleCloseInviteForm }: Props) {
  const { t } = useTranslation("mediaProfile");
  const notificationCtx = useContext(NotificationContext);

  const handleSubmit = () => {
    notificationCtx.showNotification({
      message: t("messageSuccessInvite"),
      status: NotificationStatusEnum.SUCCESS,
    });
    handleCloseInviteForm();
  };

  return (
    <div>
      <Dialog
        open={openInviteForm}
        onClose={handleCloseInviteForm}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{t("textInviteCollaborators")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("descriptionModalDialogInvite")}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={t("placeholderName")}
            type="text"
            fullWidth
          />
          <TextField
            margin="dense"
            id="email"
            label={t("placeholderEmail")}
            type="email"
            fullWidth
          />
          <Select label={t("placeholderPermission")} variant={SelectVariantEnum.STANDARD} id="1" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInviteForm} color="primary">
            {t("buttonCancelModalDialogInvite")}
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {t("buttonOkModalDialogInvite")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
