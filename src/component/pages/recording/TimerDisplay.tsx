import React from "react";
// import { TextColorEnum, TextVariantEnum } from "@/enums/*";
import { TextVariantEnum } from "@/enums/*";
import Text from "@/components/ui/Text";
// import { useTranslation } from "next-i18next";

function format2digits(value: number) {
  return value < 10 ? `0${value.toString()}` : value;
}

type Props = {
  seconds: number;
  minutes: number;
  // isRunning: boolean;
};

export default function TimerDisplay({ seconds, minutes }: Props) {
  // const { t } = useTranslation("recording");
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "16px" }}>
          <Text variant={TextVariantEnum.H5}>
            <span>{format2digits(minutes)}</span>:<span>{format2digits(seconds)}</span>
          </Text>
        </div>
      </div>
      {/* <Text
        color={TextColorEnum.TEXTSECONDARY}

        style={{ marginTop: 5, marginBottom: 5 }}
      >
        {!isRunning ? t("pressToStartTitle") : t("pressToStopTitle")}
      </Text> */}
    </div>
  );
}
