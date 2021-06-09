import React, { useState } from "react";
import { useStopwatch } from "react-timer-hook";
import Lottie from "react-lottie";
import Recording from "component/ui/lottie/recording-blink.json";

function format2digits(value) {
  return value < 10 ? "0" + value.toString() : value;
}

export default function Timer({ redirectPage }) {
  const [stop, setStop] = useState(true);
  const { seconds, minutes, hours, start, isRunning } = useStopwatch({
    autoStart: false,
    format: "24-hour",
  });

  const recordingOptions = {
    loop: true,
    autoplay: false,
    animationData: Recording,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const initStart = () => {
    if (!stop) {
      redirectPage();
      return;
    }

    start();
    setStop(!stop);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "16px" }}>
          <span>{format2digits(hours)}</span>:
          <span>{format2digits(minutes)}</span>:
          <span>{format2digits(seconds)}</span>
        </div>
      </div>
      <button
        onClick={initStart}
        style={{ background: "none", border: "none" }}
      >
        <Lottie
          isStopped={stop}
          options={recordingOptions}
          height={95}
          width={95}
        />
      </button>
    </div>
  );
}
