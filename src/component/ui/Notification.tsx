import React, { useContext } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import NotificationContext from "@/store/context/notification-context";
import MuiAlert from "@material-ui/lab/Alert";
import { NotificationStatusEnum } from "@/enums/index";
import { NotificationStatusProps } from "@/types/index";
import { v4 as uuid } from "uuid";

type Props = {
  message: string;
  status: NotificationStatusProps;
};

function Notification({ message, status = NotificationStatusEnum.INFO }: Props) {
  const notificationCtx = useContext(NotificationContext);

  const handleClose = () => {
    notificationCtx.hideNotification();
  };

  return (
    <Snackbar key={uuid()} onClose={handleClose} open autoHideDuration={5000}>
      <MuiAlert elevation={6} onClose={handleClose} variant="filled" severity={status}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
}

export default Notification;
