import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import { currentDirection } from "@/utils/i18n";

const styles: any = (theme: any) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});
const DialogTitle = withStyles(styles)((props: any) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

type Props = {
  title?: string;
  description?: string;
  open: boolean;
  handleClose?: (event: any, reason: string) => void | undefined;
  children: React.ReactNode;
  actions?: React.ReactNode;
  disableBackdropClick?: boolean;
};

function Modal({ title, description, open, handleClose, children, actions, ...props }: Props) {
  return (
    <Dialog
      dir={currentDirection()}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      maxWidth="xs"
      {...props}
    >
      {title && (
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {title}
        </DialogTitle>
      )}
      <DialogContent dividers>
        {description && <DialogContentText>{description}</DialogContentText>}
        {children}
      </DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}

export default Modal;
