import React from "react";
import Box from "@material-ui/core/Box";
import theme from "@/styles/theme";
import Text from "@/components/ui/Text";
import { TextVariantEnum, ButtonVariantEnum } from "@/enums/*";
// import IconButton from "@/components/ui/IconButton";
// import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import { isSubadminProfile } from "@/utils/permissions";
import Button from "@/components/ui/Button";
import AvatarWithContextMenu from "@/components/pages/media-profile/AvatarWithContextMenu";

export default function HeaderMediaProfile() {
  // const { t: c } = useTranslation("common");
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
      <AvatarWithContextMenu size={10} showEditImage={isSubadminProfile()} />
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
          <Button
            component="a"
            style={{ color: colorBody1, fontSize: 12, textAlign, marginLeft: 0, paddingLeft: 0 }}
            title={userRdx.user.media?.url}
            target="blank"
            url={userRdx.user.media?.url}
            variant={ButtonVariantEnum.TEXT}
          />
          {/* <IconButton
            handleClick={() => toast(c("featureUnavailable"), "warning")}
            icon="speaker"
            fontSizeIcon="small"
            iconColor="#fff"
          /> */}
        </Box>
      </Box>
    </Box>
  );
}
