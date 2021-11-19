import React, { useContext } from "react";
import Box from "@material-ui/core/Box";
import theme from "@/styles/theme";
import UserAvatar from "@/components/ui/Avatar";
import Text from "@/components/ui/Text";
import { TextVariantEnum, NotificationStatusEnum } from "@/enums/*";
import IconButton from "@/components/ui/IconButton";
import NotificationContext from "@/store/context/notification-context";
import { useTranslation } from "next-i18next";

export default function HeaderMediaProfile() {
  const { t: c } = useTranslation("common");
  const notificationCtx = useContext(NotificationContext);

  const textAlign = "left";
  const colorBody1 = "#D2D3DC";

  return (
    <Box
      padding={3}
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      flexDirection="row"
      style={{ backgroundColor: theme.palette.primary.main, width: "100%" }}
    >
      <UserAvatar size={10} name="Radio Colmena" />
      <Box
        display="flex"
        flexDirection="column"
        marginLeft={2}
        flex={1}
        justifyContent="flex-start"
      >
        <Text
          variant={TextVariantEnum.BODY2}
          style={{ color: colorBody1, fontSize: 12, textAlign }}
        >
          Gulf Radio is a community radio based in kosele town, rachuonyo subcounty in homabay
          county in Kenya.
        </Text>
        <Box
          display="flex"
          marginTop={1}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text
            variant={TextVariantEnum.BODY2}
            style={{ color: colorBody1, fontSize: 12, textAlign }}
          >
            htt://www.radiotal.org
          </Text>
          <IconButton
            handleClick={() =>
              notificationCtx.showNotification({
                message: c("featureUnavailable"),
                status: NotificationStatusEnum.WARNING,
              })
            }
            icon="speaker"
            fontSizeIcon="small"
            iconColor="#fff"
          />
        </Box>
      </Box>
    </Box>
  );
}
