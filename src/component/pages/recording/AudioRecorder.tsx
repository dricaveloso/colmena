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
import {
  PropsAudioData,
  PropsRecordingSelector,
  PropsUserSelector,
  PropsConfigSelector,
  PropsLibrarySelector,
} from "@/types/index";
import { useSelector } from "react-redux";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { useTranslation } from "next-i18next";
import IconButton from "@/components/ui/IconButton";
import Button from "@/components/ui/Button";
import Box from "@material-ui/core/Box";
import { ButtonVariantEnum, TextVariantEnum, DefaultAudioTypeEnum } from "@/enums/*";
import { useRouter } from "next/router";
import Text from "@/components/ui/Text";
import theme from "@/styles/theme";
import { format } from "date-fns";
import { convertPrivateToUsername, getPrivatePath } from "@/utils/directory";
import Waves from "@/components/pages/file/AudioWave/Waves";
import { getAccessedPages } from "@/utils/utils";

type Props = {
  onStopRecording: (audioData: PropsAudioData) => void;
  tempFileName: string;
};

// type StyleProps = {
//   width: string;
//   height: string;
// };

function AudioRecorder({ onStopRecording, tempFileName }: Props) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const router = useRouter();
  const { t } = useTranslation("recording");
  const recordingRdx = useSelector(
    (state: { recording: PropsRecordingSelector }) => state.recording,
  );
  const state = recordingRdx.activeRecordingState;
  const { isPlayingAudioPreview } = recordingRdx;
  const [audioStream, setAudioStream] = useState<MediaStream | undefined>(undefined);
  const [mediaRcdr, setMediaRcdr] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isStop, setIsStop] = useState(false);
  const [removeCanvas, setRemoveCanvas] = useState(false);
  const theme = useTheme();
  const [pathLocationSave, setPathLocationSave] = useState("");
  const configRdx = useSelector((state: { config: PropsConfigSelector }) => state.config);
  const libraryRdx = useSelector((state: { library: PropsLibrarySelector }) => state.library);

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
      if (mediaRcdr) {
        mediaRcdr.stop();
      }
      // audioStream.getTracks().forEach((track) => {
      //   track.stop();
      // });
      setMediaRcdr(null);
    }
  }, [audioStream, mediaRcdr]);

  const pauseRecording = useCallback(() => {
    if (mediaRcdr) {
      mediaRcdr.pause();
      setIsPaused(true);
      setIsStop(false);
      setIsRecording(false);
      // setRemoveCanvas(true);
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
    (async () => {
      const pathUp = await prepareUploadPath();
      setPathLocationSave(pathUp);
    })();
    init(state);
  }, [state]);

  async function getAudioStream() {
    try {
      return await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      return null;
    }
  }

  const getInformationRecordingState = () => {
    switch (recordingRdx.activeRecordingState) {
      case "NONE":
        return t("recordingOrientation");
      case "START":
        return t("recordingTitle");
      case "PAUSE":
        return t("pausingTitle");
      case "STOP":
        return t("stopingTitle");
      default:
        return t("recordingOrientation");
    }
  };

  async function prepareUploadPath() {
    if (pathLocationSave) return pathLocationSave;

    const accessedPages = await getAccessedPages();
    const urlOrigin = accessedPages[1] || accessedPages[0];
    let url = "";

    if (/^[/]library/.test(urlOrigin)) {
      if ((urlOrigin.match(/[/]/g) || []).length > 1) {
        const path = libraryRdx.currentPath;
        url = convertPrivateToUsername(path, userRdx.user.id).replace(/[/]library[/]/, "");
      }
    }

    if (/^[/]honeycomb/.test(urlOrigin)) {
      const url_ = urlOrigin.split("/");
      if (url_.length > 4) {
        url = decodeURI(url_[url_.length - 2]);
      }
    }

    return url || convertPrivateToUsername(getPrivatePath(), userRdx.user.id);
  }

  function showRecordingInformation() {
    return (
      <Box display="flex" flexDirection="column" justifyContent="flex-start">
        <Text
          variant={TextVariantEnum.CAPTION}
          style={{ color: theme.palette.variation5.light, fontSize: 16 }}
        >
          {format(new Date(), "dd/MM/yyyy")}
        </Text>
        <Text
          variant={TextVariantEnum.CAPTION}
          style={{ color: theme.palette.variation5.light, fontSize: 16 }}
        >
          /{pathLocationSave}
        </Text>
      </Box>
    );
  }

  function getJustifyContentBasedOnRecordingStatus() {
    if (isRecording) return "center";
    if (isPaused) return "cener";
    return "flex-start";
  }

  return (
    <>
      <Box>
        <Text
          variant={TextVariantEnum.CAPTION}
          style={{ color: theme.palette.variation7.light, fontSize: 16, width: "100%" }}
        >
          {getInformationRecordingState()}
        </Text>
      </Box>
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        flex={1}
        justifyContent={getJustifyContentBasedOnRecordingStatus()}
      >
        {(isRecording || isPaused) && (
          <Box display="flex" flex={1} width="100%" flexDirection="column" justifyContent="center">
            <Text
              variant={TextVariantEnum.CAPTION}
              style={{ color: theme.palette.variation7.light, fontSize: 14 }}
            >
              {tempFileName}.{DefaultAudioTypeEnum.type}
            </Text>
            {!isPlayingAudioPreview ? (
              <Sinewaves
                stream={audioStream}
                removeCanvas={removeCanvas}
                height="190px"
                backgroundColor={theme.palette.variation7.dark}
                foregroundColor={theme.palette.secondary.main}
              />
            ) : (
              <Waves blob={audioBlob} play config={{ height: 190 }} />
            )}
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-around"
            >
              {showRecordingInformation()}
              <VUMeter
                stream={audioStream}
                removeCanvas={removeCanvas}
                width="70px"
                height="150px"
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}

export default AudioRecorder;
