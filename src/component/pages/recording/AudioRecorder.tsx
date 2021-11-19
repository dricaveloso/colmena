/* eslint-disable indent */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect, useCallback, useContext } from "react";
import { createObjectURL } from "blob-util";
import VUMeter from "@/components/ui/VUMeter";
import { PropsAudioData, PropsRecordingSelector } from "@/types/index";
import { useSelector } from "react-redux";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import NotificationContext from "@/store/context/notification-context";
import { NotificationStatusEnum } from "@/enums/index";
import { useTranslation } from "next-i18next";

type Props = {
  onStopRecording: (audioData: PropsAudioData) => void;
};

type StyleProps = {
  width: string;
  height: string;
};

function AudioRecorder({ onStopRecording }: Props) {
  const notificationCtx = useContext(NotificationContext);
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
  const style: StyleProps = matchXs
    ? {
        width: "5em",
        height: "20em",
      }
    : {
        width: "5em",
        height: "20em",
      };

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

  return (
    <div style={{ width: style.width, height: style.height }}>
      {isRecording && (
        <VUMeter stream={audioStream} removeCanvas={removeCanvas} canvasSize={style} />
      )}
    </div>
  );
}

export default AudioRecorder;
