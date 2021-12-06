import React, { useContext } from "react";
import Box from "@material-ui/core/Box";
import theme from "@/styles/theme";
import UserAvatar from "@/components/ui/Avatar";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import Text from "@/components/ui/Text";
import { TextVariantEnum, NotificationStatusEnum } from "@/enums/*";
import IconButton from "@/components/ui/IconButton";
import NotificationContext from "@/store/context/notification-context";
import { useTranslation } from "next-i18next";

export default function HeaderProfile() {
  const { t: c } = useTranslation("common");
  const notificationCtx = useContext(NotificationContext);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  const textAlign = "left";
  const colorBody1 = "#ffffff";
  const colorBody2 = "#D2D3DC";

  return (
    <Box
      padding={3}
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      flexDirection="row"
      style={{ backgroundColor: theme.palette.primary.main, width: "100%" }}
    >
      <UserAvatar size={10} name={userRdx?.user.name} />
      <Box
        display="flex"
        flexDirection="column"
        marginLeft={2}
        flex={1}
        justifyContent="flex-start"
      >
        <Text variant={TextVariantEnum.BODY1} style={{ color: colorBody1, textAlign }}>
          {userRdx.user.media?.name}
        </Text>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Text variant={TextVariantEnum.BODY2} style={{ color: colorBody2, textAlign }}>
            {Array.isArray(userRdx.user.subadmin) && userRdx.user.subadmin.length > 0
              ? c("administratorTitle")
              : c("collaboratorTitle")}
          </Text>
          <IconButton
            handleClick={() =>
              notificationCtx.showNotification({
                message: c("featureUnavailable"),
                status: NotificationStatusEnum.WARNING,
              })
            }
            icon="question"
            fontSizeIcon="small"
            iconColor="#fff"
          />
        </Box>
      </Box>
    </Box>
  );
}
