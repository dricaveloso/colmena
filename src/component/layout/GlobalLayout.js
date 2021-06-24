import React, { useContext } from "react";
import Notification from "component/ui/Notification";
import NotificationContext from "store/notification-context";

function GlobalLayout({ children }) {
  const notificationCtx = useContext(NotificationContext);

  const activeNotification = notificationCtx.notification;

  return (
    <>
      {children}
      {activeNotification && (
        <Notification
          message={activeNotification.message}
          status={activeNotification.status}
        />
      )}
    </>
  );
}

export default GlobalLayout;
