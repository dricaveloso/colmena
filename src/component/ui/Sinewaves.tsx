/* eslint-disable no-plusplus */
/* eslint-disable no-inner-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

type Props = {
  stream: MediaStream | undefined;
  removeCanvas?: boolean;
  height: string;
  backgroundColor: string;
  foregroundColor: string;
};

export default function Sinewaves({
  stream,
  removeCanvas = false,
  height,
  backgroundColor = "#fff",
  foregroundColor = "#000",
}: Props) {
  function init() {
    if (removeCanvas) {
      const canvas = document.getElementById("canvas");
      canvas?.remove();
    }

    if (stream && !removeCanvas) {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);

      const canvasWrapper = document.getElementById("wrapperSinewaves");
      const canvas = document.createElement("canvas");
      canvas.setAttribute("id", "canvasWrapperSinewaves");
      canvas.style.width = "100%";
      canvas.style.height = height;
      canvasWrapper?.appendChild(canvas);

      const canvasCtx = canvas.getContext("2d");

      draw();

      function draw() {
        const WIDTH = canvas?.width;
        const HEIGHT = canvas?.height;

        requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        if (!canvasCtx) return;

        canvasCtx.fillStyle = backgroundColor;
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = foregroundColor;

        canvasCtx.beginPath();

        const sliceWidth = (WIDTH * 1.0) / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * HEIGHT) / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      }
    }
  }

  useEffect(() => {
    init();
  }, []);

  if (!stream) return <div></div>;

  return <div id="wrapperSinewaves"></div>;
}
