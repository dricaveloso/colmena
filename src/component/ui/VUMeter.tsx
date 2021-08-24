import React, { useEffect, useCallback } from "react";
import webAudioPeakMeter from "web-audio-peak-meter";

type Props = {
  stream: MediaStream | undefined;
  removeCanvas?: boolean;
  canvasSize: {
    width: string;
    height: string;
  };
};

export default function VUMeter({ stream, removeCanvas = false, canvasSize }: Props) {
  const init = useCallback(() => {
    if (removeCanvas) {
      const canvas = document.getElementById("canvas");
      canvas?.remove();
    }

    if (stream && !removeCanvas) {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 32;

      source.connect(analyser);

      const canvasWrapper = document.getElementById("canvasWrapper");
      const canvas = document.createElement("div");
      canvas.setAttribute("id", "canvas");
      canvas.style.width = canvasSize.width;
      canvas.style.height = canvasSize.height;
      canvas.style.margin = "1em 0";
      canvasWrapper?.appendChild(canvas);
      const meterNode = webAudioPeakMeter.createMeterNode(source, audioCtx);
      webAudioPeakMeter.createMeter(canvas, meterNode, {});
    }
  }, [stream, removeCanvas, canvasSize]);

  useEffect(() => {
    init();
  }, [init]);

  if (!stream) return <div></div>;

  return <div id="canvasWrapper"></div>;
}
