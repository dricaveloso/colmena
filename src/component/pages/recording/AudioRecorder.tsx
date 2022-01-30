/* eslint-disable indent */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect, useCallback, useContext } from "react";
import { createObjectURL } from "blob-util";
import VUMeter from "@/components/ui/VUMeter";
import Sinewaves from "@/components/ui/Sinewaves";
import { PropsAudioData, PropsRecordingSelector, PropsUserSelector } from "@/types/index";
import { useSelector } from "react-redux";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { useTranslation } from "next-i18next";
import IconButton from "@/components/ui/IconButton";
import Button from "@/components/ui/Button";
import Box from "@material-ui/core/Box";
import { ButtonVariantEnum, TextVariantEnum } from "@/enums/*";
import { useRouter } from "next/router";
import Text from "@/components/ui/Text";
import theme from "@/styles/theme";

type Props = {
  onStopRecording: (audioData: PropsAudioData) => void;
};

type StyleProps = {
  width: string;
  height: string;
};

function AudioRecorder({ onStopRecording }: Props) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const router = useRouter();
  const { t } = useTranslation("recording");
  const recordingRdx = useSelector(
    (state: { recording: PropsRecordingSelector }) => state.recording,
  );
  const state = recordingRdx.activeRecordingState;
  const [audioStream, setAudioStream] = useState<MediaStream | undefined>(undefined);
  const [mediaRcdr, setMediaRcdr] = useState<MediaRecorder | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isStop, setIsStop] = useState(false);
  const [removeCanvas, setRemoveCanvas] = useState(false);
  const theme = useTheme();
  const matchXs = useMediaQuery(theme.breakpoints.down("sm"));
  const styleMatchXs = {
    width: "5em",
    height: "20em",
  };
  const styleMatchRest = {
    width: "5em",
    height: "20em",
  };
  const style: StyleProps = matchXs ? styleMatchXs : styleMatchRest;

  const startRecording = useCallback(async () => {
    let mediaRecorder: MediaRecorder | null = mediaRcdr;

    if (mediaRecorder?.state === "recording") return;

    if (!mediaRecorder) {
      const stream = await getAudioStream();
      if (!stream) {
        return;
      }
      mediaRecorder = new MediaRecorder(stream);
      setAudioStream(stream);
      setMediaRcdr(mediaRecorder);
    }

    const chunks: any[] = [];
    mediaRecorder.ondataavailable = ({ data }) => {
      chunks.push(data);
    };
    mediaRecorder.onstop = async () => {
      setIsRecording(false);
      setIsPaused(false);
      const blob = new Blob(chunks, { type: mediaRecorder?.mimeType });
      const blobUrl = createObjectURL(blob);
      onStopRecording({ blob, blobUrl });
    };

    if (mediaRecorder.state !== "recording") resetStates();

    if (mediaRecorder.state === "paused") mediaRecorder.resume();
    else if (mediaRecorder.state === "inactive") {
      mediaRecorder.start();
    }
  }, [mediaRcdr, onStopRecording]);

  function resetStates() {
    setIsPaused(false);
    setIsStop(false);
    setIsRecording(true);
    setRemoveCanvas(false);
  }

  const stopRecording = useCallback(() => {
    if (audioStream) {
      setIsPaused(false);
      setIsStop(true);
      setIsRecording(false);
      setRemoveCanvas(true);
      audioStream.getTracks().forEach((track) => {
        track.stop();
      });
      setMediaRcdr(null);
    }
  }, [audioStream]);

  const pauseRecording = useCallback(() => {
    if (mediaRcdr) {
      mediaRcdr.pause();
      setIsPaused(true);
      setIsStop(false);
      setIsRecording(false);
      setRemoveCanvas(true);
    }
  }, [mediaRcdr]);

  const init = useCallback(
    (state) => {
      if (state === "START") startRecording();
      if (state === "STOP") stopRecording();

      if (state === "PAUSE") pauseRecording();
    },
    [startRecording, stopRecording, pauseRecording],
  );

  useEffect(() => {
    init(state);
  }, [state]);

  async function getAudioStream() {
    try {
      return await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      return null;
    }
  }

  // const navigate = () => {
  //   router.push(`/library/${userRdx.user.id}/audios`);
  // };

  const getInformationRecordingState = () => {
    switch (recordingRdx.activeRecordingState) {
      case "NONE":
        return t("recordingOrientation");
      case "START":
        return t("recordingTitle");
      case "PAUSE":
        return t("pausingTitle");
      default:
        return t("recordingOrientation");
    }
  };

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      flex={1}
      justifyContent={isRecording ? "center" : "flex-start"}
    >
      <Text
        variant={TextVariantEnum.CAPTION}
        style={{ color: theme.palette.darkBlue.light, fontSize: 14, width: "100%" }}
      >
        {getInformationRecordingState()}
      </Text>
      {isRecording && (
        <Box display="flex" flex={1} width="100%" flexDirection="column" justifyContent="center">
          <Sinewaves
            stream={audioStream}
            removeCanvas={removeCanvas}
            height="190px"
            backgroundColor={theme.palette.darkBlue.main}
            foregroundColor={theme.palette.secondary.main}
          />
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-around">
            <Box display="flex" flexDirection="column" justifyContent="flex-start">
              <Text
                variant={TextVariantEnum.CAPTION}
                style={{ color: theme.palette.darkBlue.light }}
              >
                New recording
              </Text>
              <Text
                variant={TextVariantEnum.CAPTION}
                style={{ color: theme.palette.darkBlue.light }}
              >
                12/12/2022
              </Text>
              <Text
                variant={TextVariantEnum.CAPTION}
                style={{ color: theme.palette.darkBlue.light }}
              >
                /devteam
              </Text>
            </Box>
            <VUMeter stream={audioStream} removeCanvas={removeCanvas} width="70px" height="150px" />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default AudioRecorder;
