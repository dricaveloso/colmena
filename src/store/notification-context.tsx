import React, { createContext, useState } from "react";

interface NotificationContextInterface {
  notification: {};
  showNotification: (notificationData: {}) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextInterface>({
  notification: null,
  showNotification: (notificationData: {}) => {},
  hideNotification: () => {},
});

export function NotificationContextProvider(props): React.ReactNode {
  const [activeNotification, setActiveNotification] = useState<{} | null>();

  function showNotificationHandler(notificationData: {}): void {
    setActiveNotification(notificationData);
  }

  function hideNotificationHandler(): void {
    setActiveNotification(null);
  }

  const context: NotificationContextInterface = {
    notification: activeNotification,
    showNotification: showNotificationHandler,
    hideNotification: hideNotificationHandler,
  };

  return (
    <NotificationContext.Provider value={context}>
      {props.children}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;
