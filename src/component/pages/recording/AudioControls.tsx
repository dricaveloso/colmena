/* eslint-disable no-underscore-dangle */
import React from "react";
import { useSelector } from "react-redux";
import { PropsRecordingSelector } from "@/types/*";
import IconButton from "@/components/ui/IconButton";
import Box from "@material-ui/core/Box";

type Props = {
  handleStop: () => void;
  handleStart: () => void;
  handlePause: () => void;
  showPause?: boolean;
  showStop?: boolean;
};

export default function AudioControls({
  handleStop,
  handleStart,
  handlePause,
  showPause = true,
  showStop = true,
}: Props) {
  console.log(showPause, showStop);
  const recordingRdx = useSelector(
    (state: { recording: PropsRecordingSelector }) => state.recording,
  );
  const _handleStart = async () => {
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
    <Box display="flex" flexDirection="row">
      {showPause && <IconButton icon="pause" handleClick={_handlePause} />}
      <div
        onClick={_handleStart}
        style={{
          cursor: "pointer",
          width: 70,
          backgroundColor: "tomato",
          height: 70,
          borderRadius: "50%",
        }}
      />
      {showStop && <IconButton icon="stop" handleClick={_handleStop} />}
    </Box>
  );
}
