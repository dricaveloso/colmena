/* eslint-disable no-underscore-dangle */
import React, { useState } from "react";
import Lottie from "react-lottie";
import Recording from "@/components/ui/lottie/recording-blink.json";
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
  const [play, setPlay] = useState(false);
  const recordingOptions = {
    loop: true,
    autoplay: false,
    animationData: Recording,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const _handleStart = async () => {
    if (recordingRdx.activeRecordingState !== "START") {
      handleStart();
      setPlay(true);
    }
  };

  const _handleStop = () => {
    if (recordingRdx.activeRecordingState === "START") {
      handleStop();
      setPlay(false);
    }
  };

  const _handlePause = () => {
    if (recordingRdx.activeRecordingState === "START") {
      handlePause();
      setPlay(false);
    }
  };

  return (
    <Box display="flex" flexDirection="row">
      {showPause && <IconButton icon="pause" handleClick={_handlePause} />}
      <button type="button" onClick={_handleStart} style={{ background: "none", border: "none" }}>
        <Lottie isStopped={!play} options={recordingOptions} height={95} width={95} />
      </button>
      {showStop && <IconButton icon="stop" handleClick={_handleStop} />}
    </Box>
  );
}
