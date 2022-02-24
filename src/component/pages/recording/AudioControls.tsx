/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PropsRecordingSelector } from "@/types/*";
import IconButton from "@/components/ui/IconButton";
import { updatePlayingAudioPreview } from "@/store/actions/recordings/index";
import Box from "@material-ui/core/Box";
import theme from "@/styles/theme";
import { toast } from "@/utils/notifications";
import { useTranslation } from "next-i18next";
import { getAudioStream } from "@/components/pages/recording/AudioRecorder";
import { getMicrophonePermission } from "@/utils/utils";

type Props = {
  handleStop: () => void;
  handleStart: () => void;
  handlePause: () => void;
};

export default function AudioControls({ handleStop, handleStart, handlePause }: Props) {
  const dispatch = useDispatch();
  const { t: c } = useTranslation("common");
  const [recordButtonActive, setRecordButtonActive] = useState("yes");
  const recordingRdx = useSelector(
    (state: { recording: PropsRecordingSelector }) => state.recording,
  );
  const state = recordingRdx.activeRecordingState;

  useEffect(() => {
    setTimeout(async () => {
      const micPer = await getMicrophonePermission();
      console.log(micPer);
      setRecordButtonActive(micPer);
    }, 1000);
  }, []);

  const _handleStart = () => {
    if (state !== "START") {
      dispatch(updatePlayingAudioPreview(false));
      handleStart();
    }
  };

  const handleStartIntern = async () => {
    const micPermission = await getMicrophonePermission();
    if (micPermission === "no") {
      const res = await getAudioStream();
      if (res) {
        _handleStart();
      }
    } else {
      _handleStart();
    }
  };

  const _handleStart2 = () => {
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

  const iconButtonStyle = {
    fontSize: 50,
  };
  const iconButtonRecordStyle = {
    fontSize: 70,
    marginBottom: 30,
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
          iconStyle={iconButtonStyle}
          handleClick={_handleStart2}
        />
      )}

      {["NONE", "START", "PAUSE"].includes(state) && (
        <IconButton
          icon="record_outlined"
          iconColor={recordButtonActive === "no" ? "gray" : "#F65B3A"}
          disabled={recordButtonActive === "no"}
          iconStyle={iconButtonRecordStyle}
          handleClick={state === "START" ? _handlePause : handleStartIntern}
        />
      )}

      {["START", "PAUSE"].includes(state) && (
        <IconButton
          icon="stop_outlined"
          iconColor="#fff"
          iconStyle={iconButtonStyle}
          handleClick={_handleStop}
        />
      )}
    </Box>
  );
}
