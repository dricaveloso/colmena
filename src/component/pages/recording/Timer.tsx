/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useStopwatch } from "react-timer-hook";
import AudioControls from "./AudioControls";
import TimerDisplay from "./TimerDisplay";
import { useDispatch } from "react-redux";
import { updateRecordingState } from "@/store/actions/recordings/index";

export default function Timer() {
  const dispatch = useDispatch();
  const { seconds, minutes, start, pause, reset } = useStopwatch({
    autoStart: false,
  });

  const handleStart = () => {
    start();
    dispatch(updateRecordingState({ activeRecordingState: "START" }));
  };

  const handlePause = () => {
    pause();
    dispatch(updateRecordingState({ activeRecordingState: "PAUSE" }));
  };

  const handleStop = () => {
    dispatch(updateRecordingState({ activeRecordingState: "STOP" }));
    reset(0, false);
  };

  return (
    <div>
      <TimerDisplay seconds={seconds} minutes={minutes} />
      {/* eslint-disable-next-line react/jsx-no-bind */}
      <AudioControls handleStart={handleStart} handleStop={handleStop} handlePause={handlePause} />
    </div>
  );
}
