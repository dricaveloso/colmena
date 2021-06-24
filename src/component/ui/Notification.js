import React, { useContext } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import NotificationContext from "store/notification-context";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Notification({ message, status = "info" }) {
  const notificationCtx = useContext(NotificationContext);
  console.log(status);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    notificationCtx.hideNotification();
  };

  return (
    <Snackbar
      key={"centercenter"}
      open={true}
      autoHideDuration={5000}
      onClose={() => notificationCtx.hideNotification()}
    >
      <Alert onClose={handleClose} severity={status}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Notification;
