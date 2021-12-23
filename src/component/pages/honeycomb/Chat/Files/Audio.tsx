/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import theme from "@/styles/theme";
import Box from "@material-ui/core/Box";
import IconButton from "@/components/ui/IconButton";
import getBlobDuration from "get-blob-duration";
import { fancyTimeFormat, formatBytes, removeSpecialCharacters } from "@/utils/utils";
import { createObjectURL, arrayBufferToBlob } from "blob-util";
import { findByFilename } from "@/store/idb/models/files";
import { toast } from "@/utils/notifications";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";
import {
  createFile as createQuickBlob,
  findByBasename as findQuickBlobByBasename,
} from "@/store/idb/models/filesQuickBlob";
import { listFile } from "@/services/webdav/files";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "next-i18next";

type WaveProps = {
  waveColor?: string;
  progressColor?: string;
  barWidth?: number;
  barRadius?: number;
  responsive?: boolean;
  height?: number;
  normalize?: boolean;
  partialRender?: boolean;
};

type Props = {
  filename: string;
  size: number;
  name: string;
  config?: WaveProps | undefined;
};

interface WavesurferInterface {
  current: {
    destroy: () => void;
    load: (str: string) => void;
  };
}

export function Audio({ filename, size, name, config }: Props) {
  const { t } = useTranslation("honeycomb");
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState("");
  const [loadingAudioFile, setLoadingAudioFile] = useState(false);
  const waveformRef = useRef(null);
  const wavesurfer: WavesurferInterface | any = useRef(null);

  const formWaveSurferOptions = (ref: any) => ({
    container: ref,
    waveColor: "#eee",
    progressColor: theme.palette.secondary.main,
    // cursorColor: "OrangeRed",
    barWidth: 2,
    barRadius: 1,
    responsive: true,
    height: 24,
    normalize: true,
    partialRender: true,
    ...config,
  });

  async function prepareAudioBlob(content: ArrayBuffer) {
    const blob = arrayBufferToBlob(content);
    const urlBlob = createObjectURL(blob);
    const duration = await getBlobDuration(urlBlob);
    await createWavesurfer(blob);
    setDuration(fancyTimeFormat(duration));
  }

  useEffect(() => {
    (async () => {
      try {
        const localFile = await findByFilename(filename);
        const localFileQuickFile = await findQuickBlobByBasename(
          userRdx.user.id,
          removeSpecialCharacters(filename),
        );
        if (localFile || localFileQuickFile)
          await prepareAudioBlob(localFileQuickFile?.arrayBufferBlob || localFile?.arrayBufferBlob);
      } catch (e) {
        console.log("aquiiiiiii", e);
      }
    })();

    return () => {
      setDuration("");
      setPlaying(false);

      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, []);

  async function createWavesurfer(blob: Blob) {
    try {
      const WaveSurfer = (await import("wavesurfer.js")).default;
      const options = formWaveSurferOptions(waveformRef.current);
      wavesurfer.current = WaveSurfer.create(options);
      wavesurfer?.current.loadBlob(blob);

      wavesurfer?.current.on("error", (error: string) => {
        toast(error, "error");
      });
    } catch (e) {
      console.log("flamengo", e);
      // error container element not found
    }
  }

  const handlePlayPause = () => {
    setPlaying(!playing);
    wavesurfer?.current.playPause();
  };

  const downloadAudioFile = async () => {
    try {
      setLoadingAudioFile(true);
      const result: any = await listFile(userRdx.user.id, filename);
      await createQuickBlob({
        basename: removeSpecialCharacters(filename),
        userId: userRdx.user.id,
        arrayBufferBlob: result,
      });
      await prepareAudioBlob(result);
    } catch (e) {
      toast(t("downloadAudioFailed"), "error");
    } finally {
      setLoadingAudioFile(false);
    }
  };

  return (
    <Box
      display="flex"
      flex={1}
      flexDirection="row"
      padding={1}
      borderRadius={4}
      border={2}
      borderColor="#E0E0E0"
      alignContent="center"
      height={70}
    >
      {duration ? (
        <IconButton
          icon={playing ? "pause" : "play"}
          iconStyle={{ fontSize: 36 }}
          handleClick={handlePlayPause}
          iconColor={theme.palette.primary.main}
        />
      ) : (
        <IconButton
          icon="music"
          iconStyle={{ fontSize: 36 }}
          iconColor={theme.palette.primary.main}
        />
      )}
      <Box display="flex" flex={1} flexDirection="column">
        <div style={{ width: "100%" }} id={`waveform-${btoa(filename)}`} ref={waveformRef} />
        {duration ? (
          <Box display="flex" flex={1} justifyContent="space-between">
            <Text variant={TextVariantEnum.CAPTION}>{duration}</Text>
            <Text variant={TextVariantEnum.CAPTION}>{formatBytes(size)}</Text>
          </Box>
        ) : (
          <Box display="flex" flex={1} flexDirection="column" justifyContent="center">
            <Text variant={TextVariantEnum.CAPTION}>{name}</Text>
            <Text variant={TextVariantEnum.CAPTION}>{formatBytes(size)}</Text>
          </Box>
        )}
      </Box>
      {!duration && !loadingAudioFile && (
        <IconButton
          icon="download"
          iconStyle={{ fontSize: 20 }}
          handleClick={downloadAudioFile}
          iconColor={theme.palette.secondary.main}
        />
      )}
      {!duration && loadingAudioFile && (
        <CircularProgress style={{ marginTop: 10, marginRight: 16 }} size={20} />
      )}
    </Box>
  );
}

export const MemoizedAudio = React.memo(Audio);
