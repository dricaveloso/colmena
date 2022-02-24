/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { toast } from "@/utils/notifications";
import Box from "@material-ui/core/Box";
import { makeStyles, Theme } from "@material-ui/core/styles";
import IconButton from "@/components/ui/IconButton";
import theme from "@/styles/theme";

const useStyles = makeStyles((theme: Theme) => ({
  extraElementWrapper: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  verticalDivider: {
    width: 0.8,
    height: 30,
    backgroundColor: theme.palette.variation7.light,
    marginLeft: 5,
    marginRight: 5,
  },
}));

type Props = {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleSelectAudioRegion: (type: string) => void;
};

export default function HeaderControls({
  handleZoomIn,
  handleZoomOut,
  handleSelectAudioRegion,
}: Props) {
  const classes = useStyles();
  const { t: c } = useTranslation("common");
  const [isSelectedCursorActive, setIsSelectedCursorActive] = useState(false);

  const buttonHeaderStyle = {
    width: 28,
  };

  const unavailable = () => {
    toast(c("featureUnavailable"), "warning");
  };

  const handleSelectAudioRegionIntern = () => {
    setIsSelectedCursorActive((isSelectedCursorActive) => {
      handleSelectAudioRegion(!isSelectedCursorActive ? "select" : "cursor");
      return !isSelectedCursorActive;
    });
  };

  return (
    <Box className={classes.extraElementWrapper}>
      <IconButton
        icon="zoomin"
        iconColor={theme.palette.icon.light}
        handleClick={handleZoomIn}
        iconStyle={buttonHeaderStyle}
      />
      <IconButton
        icon="zoomout"
        iconColor={theme.palette.icon.light}
        handleClick={handleZoomOut}
        iconStyle={buttonHeaderStyle}
      />
      <IconButton
        icon="cut"
        iconColor={theme.palette.icon.light}
        handleClick={unavailable}
        iconStyle={buttonHeaderStyle}
      />
      <IconButton
        icon="cursor_select"
        iconColor={isSelectedCursorActive ? "#fff" : theme.palette.icon.light}
        handleClick={handleSelectAudioRegionIntern}
        iconStyle={buttonHeaderStyle}
      />
      <Box className={classes.verticalDivider}></Box>
      <IconButton
        icon="download"
        iconColor={theme.palette.icon.light}
        handleClick={unavailable}
        iconStyle={buttonHeaderStyle}
      />
      <IconButton
        icon="save"
        iconColor={theme.palette.icon.light}
        handleClick={unavailable}
        iconStyle={buttonHeaderStyle}
      />
    </Box>
  );
}
