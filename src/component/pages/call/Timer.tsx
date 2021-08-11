import React, { useState } from "react";
import { useStopwatch } from "react-timer-hook";
import Lottie from "react-lottie";
import Recording from "@/components/ui/lottie/recording-blink.json";
import Text from "@/components/ui/Text";
import { TextColorEnum, TextVariantEnum } from "@/enums/*";
import { useTranslation } from "next-i18next";

function format2digits(value: number) {
  return value < 10 ? `0${value.toString()}` : value;
}

type Props = {
  handleStop: () => void;
  handleStart: () => void;
};

export default function Timer({ handleStart, handleStop }: Props) {
  const { t } = useTranslation("recording");
  const [stop, setStop] = useState(true);
  const { seconds, minutes, hours, start, pause } = useStopwatch({
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
      handleStop();
      pause();
      setStop(!stop);
      return;
    }

    start();
    handleStart();
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
      <Text
        color={TextColorEnum.TEXTSECONDARY}
        variant={TextVariantEnum.BODY2}
        style={{ marginTop: 5, marginBottom: 5 }}
      >
        {stop ? t("pressToStartTitle") : t("pressToStopTitle")}
      </Text>
      <button type="button" onClick={initStart} style={{ background: "none", border: "none" }}>
        <Lottie isStopped={stop} options={recordingOptions} height={95} width={95} />
      </button>
    </div>
  );
}
