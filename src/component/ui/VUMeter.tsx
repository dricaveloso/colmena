/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback } from "react";
import webAudioPeakMeter from "web-audio-peak-meter";

type Props = {
  stream: MediaStream | undefined;
  removeCanvas?: boolean;
  width: string;
  height: string;
};

export default function VUMeter({ stream, removeCanvas = false, width, height }: Props) {
  function createCanvas() {
    const canvasWrapper = document.getElementById("canvasWrapper");
    const canvas = document.createElement("div");
    canvas.setAttribute("id", "canvas");
    canvas.style.width = width;
    canvas.style.height = height;
    canvas.style.margin = "1em 0";
    canvasWrapper?.appendChild(canvas);
    return canvas;
  }

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

      const canvas = createCanvas();

      const meterNode = webAudioPeakMeter.createMeterNode(source, audioCtx);
      webAudioPeakMeter.createMeter(canvas, meterNode, {});
    }
  }, [stream, removeCanvas]);

  useEffect(() => {
    init();
  }, [init]);

  if (!stream) return <div></div>;

  return <div id="canvasWrapper"></div>;
}
