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
  blob: Blob | null;
  config?: WaveProps | undefined;
};

export default function Waves({ blob, config = undefined }: Props) {
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
  }, []);

  const create = async () => {
    try {
      const WaveSurfer = (await import("wavesurfer.js")).default;

      const options = formWaveSurferOptions(waveformRef.current);
      wavesurfer.current = WaveSurfer.create(options);

      wavesurfer?.current.loadBlob(blob);
      setTimeout(() => {
        wavesurfer?.current?.play();
      }, 800);
    } catch (e) {
      // error container element not found
    }
  };

  return <div style={{ width: "100%" }} id={`waveform-${uuid()}`} ref={waveformRef} />;
}
