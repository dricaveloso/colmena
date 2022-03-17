import React from "react";
import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import { TextVariantEnum, ButtonVariantEnum } from "@/enums/*";
// import IconButton from "@/components/ui/IconButton";
// import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import { isSubadminProfile } from "@/utils/permissions";
import Button from "@/components/ui/Button";
import AvatarWithContextMenu from "@/components/pages/media-profile/AvatarWithContextMenu";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: theme.palette.primary.main,
    width: "100%",
  },
  containerMedia: {
    display: "flex",
    flexDirection: "column",
    marginLeft: theme.spacing(2),
    flex: 1,
    justifyContent: "flex-start",
  },
  containerMediaUrl: {
    display: "flex",
    marginTop: theme.spacing(1),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mediaTitle: {
    color: "#D2D3DC",
    fontSize: 12,
    textAlign: "left",
  },
  mediaUrl: {
    color: "#D2D3DC",
    fontSize: 12,
    textAlign: "left",
    marginLeft: 0,
    paddingLeft: 0,
  },
}));

export default function HeaderMediaProfile() {
  const classes = useStyles();
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  return (
    <Box className={classes.container}>
      <AvatarWithContextMenu size={10} showEditImage={isSubadminProfile()} />
      <Box className={classes.containerMedia}>
        <Text variant={TextVariantEnum.BODY2} className={classes.mediaTitle}>
          {userRdx.user.media?.slogan}
        </Text>
        <Box className={classes.containerMediaUrl}>
          <Button
            component="a"
            className={classes.mediaUrl}
            title={userRdx.user.media?.url}
            target="blank"
            url={userRdx.user.media?.url}
            variant={ButtonVariantEnum.TEXT}
          />
        </Box>
      </Box>
    </Box>
  );
}
