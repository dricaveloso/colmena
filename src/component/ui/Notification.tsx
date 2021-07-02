import React, { useContext } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import NotificationContext from "store/notification-context";
import MuiAlert from "@material-ui/lab/Alert";
import { NotificationStatusEnum } from "enums";
import { NotificationStatusProps } from "types";

type Props = {
  message: string;
  status: NotificationStatusProps;
};

function Notification({ message, status = NotificationStatusEnum.INFO }: Props) {
  const notificationCtx = useContext(NotificationContext);

  const handleClose = (event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }

    notificationCtx.hideNotification();
  };

  return (
    <Snackbar key={"centercenter"} onClose={handleClose} open={true} autoHideDuration={5000}>
      <MuiAlert elevation={6} variant="filled" severity={status}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
}

export default Notification;
