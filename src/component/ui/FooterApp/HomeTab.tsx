import React, { useContext } from "react";
import IconButton from "@/components/ui/IconButton";
import { NotificationStatusEnum } from "@/enums/index";
import NotificationContext from "@/store/context/notification-context";
import { useTranslation } from "next-i18next";
import Box from "@material-ui/core/Box";

function HomeTab() {
  const notificationCtx = useContext(NotificationContext);
  const { t } = useTranslation("common");

  return (
    <>
      <Box>
        <IconButton icon="settings" url="/home" />
      </Box>
      <Box>
        <IconButton
          icon="edit"
          handleClick={() =>
            notificationCtx.showNotification({
              message: t("featureUnavailable"),
              status: NotificationStatusEnum.WARNING,
            })
          }
        />
      </Box>
      <Box>
        <IconButton icon="microphone" url="/call" />
      </Box>
      <Box>
        <IconButton icon="library" url="/library" />
      </Box>
      <Box>
        <IconButton icon="cut" url="/edit-audio" />
      </Box>
      <Box>
        <IconButton icon="world_map" url="/edit-audio" />
      </Box>
    </>
  );
}

export default HomeTab;
