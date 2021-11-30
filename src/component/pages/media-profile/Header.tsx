import React, { useContext } from "react";
import Box from "@material-ui/core/Box";
import theme from "@/styles/theme";
import UserAvatar from "@/components/ui/Avatar";
import Text from "@/components/ui/Text";
import { TextVariantEnum, NotificationStatusEnum } from "@/enums/*";
import IconButton from "@/components/ui/IconButton";
import NotificationContext from "@/store/context/notification-context";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";

export default function HeaderMediaProfile() {
  const { t: c } = useTranslation("common");
  const notificationCtx = useContext(NotificationContext);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

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
      <UserAvatar size={10} name={userRdx.user.media?.name} />
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
          {userRdx.user.media?.slogan}
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
            {userRdx.user.media?.url}
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
