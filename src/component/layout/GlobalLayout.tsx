import React, { useContext } from "react";
import Notification from "@/components/ui/Notification";
import NotificationContext from "@/store/notification-context";
import { NotificationDataInterface } from "@/interfaces/index";

type Props = {
  children: React.ReactNode;
};

function GlobalLayout({ children }: Props) {
  const notificationCtx = useContext(NotificationContext);

  const activeNotification: NotificationDataInterface | null = notificationCtx.notification;

  return (
    <>
      {children}
      {activeNotification && (
        <Notification message={activeNotification.message} status={activeNotification.status} />
      )}
    </>
  );
}

export default GlobalLayout;
