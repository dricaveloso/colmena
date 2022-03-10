/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles, Theme } from "@material-ui/core/styles";
import theme from "@/styles/theme";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@/components/ui/SvgIcon";
import { useDispatch, useSelector } from "react-redux";
import { setCursorSelected } from "@/store/actions/audio-editor/index";
import { isMobile } from "react-device-detect";
import CircularProgress from "@material-ui/core/CircularProgress";
import { PropsAudioEditorSelector } from "@/types/*";
import { removeAllCustomCursorElements } from "./WaveformPlaylist";

const useStyles = makeStyles((theme: Theme) => ({
  extraElementWrapper: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  verticalDivider: {
    width: 0.8,
    height: 30,
    backgroundColor: theme.palette.variation7.light,
    marginLeft: 5,
    marginRight: 5,
  },
  actionsButton: {
    padding: 0,
    "& svg": {
      width: 25,
      padding: 0,
    },
  },
}));

type Props = {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleTrim: () => void;
  handleSelectAudioRegion: (type: string) => void;
  handleDownload: () => void;
  handleSave: () => void;
};

export default function HeaderControls({
  handleZoomIn,
  handleZoomOut,
  handleTrim,
  handleSelectAudioRegion,
  handleDownload,
  handleSave,
}: Props) {
  const classes = useStyles();
  const [loadingSave, setLoadingSave] = useState(false);
  const audioEditorRdx = useSelector(
    (state: { audioEditor: PropsAudioEditorSelector }) => state.audioEditor,
  );
  const [activeSelect, setActiveSelect] = useState(audioEditorRdx.isCursorSelected);
  const [activeShift, setActiveShift] = useState(false);
  const dispatch = useDispatch();

  const handleActiveSelected = () => {
    const actSel = !activeSelect;
    setActiveSelect(actSel);
    setActiveShift(false);
    if (!isMobile) {
      handleSelectAudioRegion("select");
      dispatch(setCursorSelected(false));
    } else {
      handleSelectAudioRegion("cursor");
      dispatch(setCursorSelected(actSel));
      if (!actSel) {
        removeAllCustomCursorElements();
      }
    }
  };

  const handleActiveShift = () => {
    const actShi = !activeShift;
    setActiveShift(actShi);
    setActiveSelect(false);
    dispatch(setCursorSelected(false));
    handleSelectAudioRegion(!actShi ? "cursor" : "shift");
  };

  const handleSaveIntern = () => {
    setLoadingSave(!loadingSave);
    handleSave();
  };

  const handleDownloadIntern = () => {
    // setLoadingDownload(!loadingDownload);
    handleDownload();
  };

  return (
    <Box className={classes.extraElementWrapper}>
      <IconButton onClick={handleZoomIn} className={classes.actionsButton}>
        <SvgIcon icon="zoomin" htmlColor={theme.palette.icon.light} />
      </IconButton>
      <IconButton onClick={handleZoomOut} className={classes.actionsButton}>
        <SvgIcon icon="zoomout" htmlColor={theme.palette.icon.light} />
      </IconButton>
      <IconButton onClick={handleActiveShift} className={classes.actionsButton}>
        <SvgIcon icon="audio_shift" htmlColor={activeShift ? "#fff" : theme.palette.icon.light} />
      </IconButton>
      <IconButton onClick={handleTrim} className={classes.actionsButton}>
        <SvgIcon icon="trim" htmlColor={theme.palette.icon.light} />
      </IconButton>
      <IconButton onClick={handleActiveSelected} className={classes.actionsButton}>
        <SvgIcon
          icon="cursor_select"
          htmlColor={activeSelect ? "#fff" : theme.palette.icon.light}
        />
      </IconButton>
      <Box className={classes.verticalDivider}></Box>
      <IconButton onClick={handleDownloadIntern} className={classes.actionsButton}>
        {/* {loadingDownload ? (
          <CircularProgress color="secondary" size="small" />
        ) : ( */}
        <SvgIcon icon="download" htmlColor={theme.palette.icon.light} />
        {/* )} */}
      </IconButton>
      <IconButton onClick={handleSaveIntern} className={classes.actionsButton}>
        {loadingSave ? (
          <CircularProgress color="secondary" size="small" />
        ) : (
          <SvgIcon icon="save" htmlColor={theme.palette.icon.light} />
        )}
      </IconButton>
    </Box>
  );
}
