/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef } from "react";
import theme from "@/styles/theme";

const formWaveSurferOptions = (ref: any) => ({
  container: ref,
  waveColor: "#eee",
  progressColor: theme.palette.secondary.main,
  // cursorColor: "OrangeRed",
  barWidth: 5,
  barRadius: 3,
  responsive: true,
  height: 65,
  normalize: true,
  partialRender: true,
});

interface WavesurferInterface {
  current: {
    destroy: () => void;
    load: (str: string) => void;
  };
}

type Props = {
  audioURL: string;
};

export default function Waves({ audioURL }: Props) {
  const waveformRef = useRef(null);
  const wavesurfer: WavesurferInterface | any = useRef(null);

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

      wavesurfer?.current.load(audioURL);
      setTimeout(() => {
        wavesurfer?.current?.play();
      }, 800);
    } catch (e) {
      // error container element not found
    }
  };

  return <div style={{ width: "100%" }} id="waveform" ref={waveformRef} />;
}
