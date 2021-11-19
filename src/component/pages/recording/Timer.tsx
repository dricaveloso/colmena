/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useStopwatch } from "react-timer-hook";
import AudioControls from "./AudioControls";
import TimerDisplay from "./TimerDisplay";
import { useDispatch } from "react-redux";
import { updateRecordingState } from "@/store/actions/recordings/index";

export default function Timer() {
  const dispatch = useDispatch();
  const { seconds, minutes, hours, isRunning, start, pause, reset } = useStopwatch({
    autoStart: false,
  });

  function handleStart() {
    start();
    dispatch(updateRecordingState({ activeRecordingState: "START" }));
  }

  function handlePause() {
    pause();
    dispatch(updateRecordingState({ activeRecordingState: "PAUSE" }));
  }

  function handleStop() {
    dispatch(updateRecordingState({ activeRecordingState: "STOP" }));
    reset(0, false);
  }

  return (
    <div>
      <TimerDisplay seconds={seconds} minutes={minutes} hours={hours} isRunning={isRunning} />
      {/* eslint-disable-next-line react/jsx-no-bind */}
      <AudioControls handleStart={handleStart} handleStop={handleStop} handlePause={handlePause} />
    </div>
  );
}
