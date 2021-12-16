/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import theme from "@/styles/theme";
import Box from "@material-ui/core/Box";
import IconButton from "@/components/ui/IconButton";
import getBlobDuration from "get-blob-duration";
import { fancyTimeFormat, formatBytes } from "@/utils/utils";
import { createObjectURL, arrayBufferToBlob } from "blob-util";
import { findByFilename } from "@/store/idb/models/files";
import { toast } from "@/utils/notifications";
import { v4 as uuid } from "uuid";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";

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
  config?: WaveProps | undefined;
};

interface WavesurferInterface {
  current: {
    destroy: () => void;
    load: (str: string) => void;
  };
}

export default function Audio({ filename, size, config }: Props) {
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState("");
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
        await prepareAudioBlob(localFile?.arrayBufferBlob);
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

      // wavesurfer?.current.on("ready", () => {
      //   setDuration(fancyTimeFormat(wavesurfer?.current.getDuration()));
      // });

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
    console.log(wavesurfer?.current.isPlaying());
    wavesurfer?.current.playPause();
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
    >
      <IconButton
        icon={playing ? "pause" : "play"}
        iconStyle={{ fontSize: 36 }}
        handleClick={handlePlayPause}
        iconColor={theme.palette.primary.main}
      />
      <Box display="flex" flex={1} flexDirection="column">
        <div style={{ width: "100%" }} id={`waveform-${uuid()}`} ref={waveformRef} />
        <Box display="flex" flex={1} justifyContent="space-between">
          <Text variant={TextVariantEnum.CAPTION}>{duration}</Text>
          <Text variant={TextVariantEnum.CAPTION}>{formatBytes(size)}</Text>
        </Box>
      </Box>
    </Box>
  );
}
