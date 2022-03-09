/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef } from "react";
import theme from "@/styles/theme";
import { v4 as uuid } from "uuid";

interface WavesurferInterface {
  current: {
    destroy: () => void;
    load: (str: string) => void;
  };
}

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
  blob?: Blob | null;
  config?: WaveProps | undefined;
  play?: boolean;
  pause?: boolean;
  handleAudioFinish: () => void;
};

export default function Waves({
  blob = null,
  config = undefined,
  play = false,
  pause = false,
  handleAudioFinish,
}: Props) {
  const waveformRef = useRef(null);
  const wavesurfer: WavesurferInterface | any = useRef(null);

  const formWaveSurferOptions = (ref: any) => ({
    container: ref,
    waveColor: "#eee",
    progressColor: theme.palette.secondary.main,
    // cursorColor: "OrangeRed",
    barWidth: 4,
    barRadius: 2,
    responsive: true,
    height: 65,
    normalize: true,
    partialRender: true,
    ...config,
  });

  useEffect(() => {
    create();
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [blob]);

  useEffect(() => {
    if (play) wavesurfer?.current?.play();
    if (pause) wavesurfer?.current?.pause();
  }, [play, pause]);

  const create = async () => {
    try {
      const WaveSurfer = (await import("wavesurfer.js")).default;
      if (blob) {
        const options = formWaveSurferOptions(waveformRef.current);
        wavesurfer.current = WaveSurfer.create(options);
        wavesurfer?.current.loadBlob(blob);

        wavesurfer?.current.on("ready", () => {
          if (play) {
            wavesurfer?.current?.play();
          }
        });

        wavesurfer?.current.on("finish", () => {
          handleAudioFinish();
          wavesurfer?.current?.setPlayEnd(0);
        });

        wavesurfer?.current.on("error", (error: string) => {
          console.log(error);
          // toast(error, "error");
        });
      }
    } catch (e) {
      // console.log(e);
      // error container element not found
    }
  };

  return <div style={{ width: "100%" }} id={`waveform-${uuid()}`} ref={waveformRef} />;
}
