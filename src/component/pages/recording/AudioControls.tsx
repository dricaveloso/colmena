/* eslint-disable no-underscore-dangle */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { PropsRecordingSelector } from "@/types/*";
import IconButton from "@/components/ui/IconButton";
import { updatePlayingAudioPreview } from "@/store/actions/recordings/index";
import Box from "@material-ui/core/Box";
import theme from "@/styles/theme";
import { toast } from "@/utils/notifications";
import { useTranslation } from "next-i18next";

type Props = {
  handleStop: () => void;
  handleStart: () => void;
  handlePause: () => void;
};

export default function AudioControls({ handleStop, handleStart, handlePause }: Props) {
  const dispatch = useDispatch();
  const { t: c } = useTranslation("common");
  const recordingRdx = useSelector(
    (state: { recording: PropsRecordingSelector }) => state.recording,
  );
  const state = recordingRdx.activeRecordingState;

  const _handleStart = () => {
    if (state !== "START") {
      dispatch(updatePlayingAudioPreview(false));
      handleStart();
    }
  };

  const _handleStart2 = () => {
    // dispatch(updatePlayingAudioPreview(true));
    toast(c("featureUnavailable"), "warning");
  };

  const _handleStop = () => {
    if (["START", "PAUSE"].includes(state)) {
      dispatch(updatePlayingAudioPreview(false));
      handleStop();
    }
  };

  const _handlePause = () => {
    if (state === "START") {
      dispatch(updatePlayingAudioPreview(false));
      handlePause();
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      flex={1}
      width="100%"
      justifyContent="space-around"
      alignItems="center"
    >
      {["START", "PAUSE"].includes(state) && (
        <IconButton
          icon="play_outlined"
          iconColor={state === "START" ? theme.palette.variation5.light : "#fff"}
          disabled={state === "START"}
          iconStyle={{ fontSize: 50 }}
          handleClick={_handleStart2}
        />
      )}

      {["NONE", "START", "PAUSE"].includes(state) && (
        <IconButton
          icon="record_outlined"
          iconStyle={{ fontSize: 70, marginBottom: 30 }}
          handleClick={state === "START" ? _handlePause : _handleStart}
        />
      )}

      {/* {["START", "PAUSE"].includes(state) && (
        <IconButton
          icon="pause_outlined"
          iconColor={state === "PAUSE" ? theme.palette.variation5.light : "#fff"}
          iconStyle={{ fontSize: 70, marginBottom: 30 }}
          handleClick={_handlePause}
        />
      )} */}

      {["START", "PAUSE"].includes(state) && (
        <IconButton
          icon="stop_outlined"
          iconColor="#fff"
          iconStyle={{ fontSize: 50 }}
          handleClick={_handleStop}
        />
      )}
    </Box>
  );
}
