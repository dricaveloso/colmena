import React, { useState } from "react";
import { useStopwatch } from "react-timer-hook";
import Lottie from "react-lottie";
import Recording from "@/components/ui/lottie/recording-blink.json";

function format2digits(value: number) {
  return value < 10 ? `0${value.toString()}` : value;
}

type Props = {
  redirectPage: () => void;
};

export default function Timer({ redirectPage }: Props) {
  const [stop, setStop] = useState(true);
  const { seconds, minutes, hours, start } = useStopwatch({
    autoStart: false,
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
          <span>{format2digits(hours)}</span>:<span>{format2digits(minutes)}</span>:
          <span>{format2digits(seconds)}</span>
        </div>
      </div>
      <button type="button" onClick={initStart} style={{ background: "none", border: "none" }}>
        <Lottie isStopped={stop} options={recordingOptions} height={95} width={95} />
      </button>
    </div>
  );
}