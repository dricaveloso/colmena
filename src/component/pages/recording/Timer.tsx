/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useStopwatch } from "react-timer-hook";
import AudioControls from "./AudioControls";
import TimerDisplay from "./TimerDisplay";
import { useDispatch } from "react-redux";
import { updateRecordingState } from "@/store/actions/recordings/index";
import Box from "@material-ui/core/Box";
import Divider from "@/components/ui/Divider";

export default function Timer() {
  const dispatch = useDispatch();
  const { seconds, minutes, start, pause, reset } = useStopwatch({
    autoStart: false,
  });

  const handleStart = () => {
    start();
    dispatch(updateRecordingState("START"));
  };

  const handlePause = () => {
    pause();
    dispatch(updateRecordingState("PAUSE"));
  };

  const handleStop = () => {
    dispatch(updateRecordingState("STOP"));
    reset(0, false);
  };

  return (
    <Box width="100%">
      <TimerDisplay seconds={seconds} minutes={minutes} />
      <Divider marginTop={3} />
      {/* eslint-disable-next-line react/jsx-no-bind */}
      <AudioControls handleStart={handleStart} handleStop={handleStop} handlePause={handlePause} />
    </Box>
  );
}
