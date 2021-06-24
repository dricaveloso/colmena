import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from "component/ui/Select";
import { useTranslation } from "next-i18next";
import NotificationContext from "store/notification-context";

export default function InviteForm({ openInviteForm, handleCloseInviteForm }) {
  const { t } = useTranslation("mediaProfile");
  const notificationCtx = useContext(NotificationContext);

  const handleSubmit = () => {
    notificationCtx.showNotification({
      message: "Convite enviado com sucesso.",
      status: "success",
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
        <DialogTitle id="form-dialog-title">Convidar colaborador</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Digite o nome, e-mail e perfil de acesso para o colaborador que
            deseja convidar.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nome"
            type="text"
            fullWidth
          />
          <TextField
            margin="dense"
            id="email"
            label="E-mail"
            type="email"
            fullWidth
          />
          <Select label={t("Permissão")} variant="standard" id="1" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInviteForm} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
