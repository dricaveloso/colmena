/* eslint-disable no-underscore-dangle */
import React from "react";
import { useSelector } from "react-redux";
import { PropsRecordingSelector } from "@/types/*";
import IconButton from "@/components/ui/IconButton";
import Box from "@material-ui/core/Box";
import theme from "@/styles/theme";

type Props = {
  handleStop: () => void;
  handleStart: () => void;
  handlePause: () => void;
};

export default function AudioControls({ handleStop, handleStart, handlePause }: Props) {
  const recordingRdx = useSelector(
    (state: { recording: PropsRecordingSelector }) => state.recording,
  );
  const _handleStart = () => {
    if (recordingRdx.activeRecordingState !== "START") {
      handleStart();
    }
  };

  const _handleStop = () => {
    if (["START", "PAUSE"].includes(recordingRdx.activeRecordingState)) {
      handleStop();
    }
  };

  const _handlePause = () => {
    if (recordingRdx.activeRecordingState === "START") {
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
      {["START", "PAUSE"].includes(recordingRdx.activeRecordingState) && (
        <IconButton
          icon="play_outlined"
          iconColor={
            recordingRdx.activeRecordingState === "START" ? theme.palette.darkBlue.light : "#fff"
          }
          disabled={recordingRdx.activeRecordingState === "START"}
          iconStyle={{ fontSize: 50 }}
          handleClick={_handleStart}
        />
      )}

      {recordingRdx.activeRecordingState === "NONE" && (
        <IconButton
          icon="record_outlined"
          iconStyle={{ fontSize: 70, marginBottom: 30 }}
          handleClick={_handleStart}
        />
      )}

      {["START", "PAUSE"].includes(recordingRdx.activeRecordingState) && (
        <IconButton
          icon="pause_outlined"
          iconColor={
            recordingRdx.activeRecordingState === "PAUSE" ? theme.palette.darkBlue.light : "#fff"
          }
          iconStyle={{ fontSize: 70, marginBottom: 30 }}
          handleClick={_handlePause}
        />
      )}

      {["START", "PAUSE"].includes(recordingRdx.activeRecordingState) && (
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
