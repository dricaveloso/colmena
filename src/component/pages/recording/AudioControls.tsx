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
    if (recordingRdx.activeRecordingState === "START") {
      handleStop();
    }
  };

  const _handlePause = () => {
    if (recordingRdx.activeRecordingState === "START") {
      handlePause();
    }
  };

  return (
    <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
      {recordingRdx.activeRecordingState === "START" && (
        <IconButton
          icon="pause"
          iconColor={theme.palette.primary.dark}
          iconStyle={{ fontSize: 80 }}
          handleClick={_handlePause}
        />
      )}

      {recordingRdx.activeRecordingState !== "START" && (
        <IconButton
          icon="record_outlined"
          iconStyle={{ fontSize: 80 }}
          iconColor="tomato"
          handleClick={_handleStart}
        />
      )}

      {recordingRdx.activeRecordingState === "START" && (
        <IconButton
          icon="stop"
          iconColor={theme.palette.secondary.main}
          iconStyle={{ fontSize: 65 }}
          handleClick={_handleStop}
        />
      )}
    </Box>
  );
}
