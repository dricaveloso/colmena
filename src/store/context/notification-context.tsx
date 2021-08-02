import React, { createContext, useState } from "react";
import { NotificationDataInterface } from "@/interfaces/index";

interface NotificationContextInterface {
  notification: NotificationDataInterface | null;
  showNotification: (notificationData: NotificationDataInterface | null) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextInterface>({
  notification: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  showNotification: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  hideNotification: () => {},
});

type Props = {
  children: React.ReactNode;
};

export function NotificationContextProvider({ children }: Props) {
  const [activeNotification, setActiveNotification] = useState<NotificationDataInterface | null>(
    null,
  );

  function showNotificationHandler(notificationData: NotificationDataInterface) {
    setActiveNotification(notificationData);
  }

  function hideNotificationHandler() {
    setActiveNotification(null);
  }

  const context: NotificationContextInterface = {
    notification: activeNotification,
    showNotification: showNotificationHandler,
    hideNotification: hideNotificationHandler,
  };

  return <NotificationContext.Provider value={context}>{children}</NotificationContext.Provider>;
}

export default NotificationContext;
