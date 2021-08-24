/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useStopwatch } from "react-timer-hook";
import AudioControls from "../recording/AudioControls";
import TimerDisplay from "../recording/TimerDisplay";
import Box from "@material-ui/core/Box";
// import { useDispatch } from "react-redux";
// import { updateRecordingState } from "@/store/actions/recordings/index";

export default function Timer() {
  // const dispatch = useDispatch();
  const { seconds, minutes, hours, isRunning, start, pause, reset } = useStopwatch({
    autoStart: false,
  });

  function handleStart() {
    start();
  }

  function handlePause() {
    pause();
  }

  function handleStop() {
    reset(0, false);
  }

  return (
    <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
      <TimerDisplay seconds={seconds} minutes={minutes} hours={hours} isRunning={isRunning} />
      <AudioControls
        showPause={false}
        showStop={false}
        handleStart={handleStart}
        handleStop={handleStop}
        handlePause={handlePause}
      />
    </Box>
  );
}
