import React from "react";
import { TextVariantEnum } from "@/enums/*";
import Text from "@/components/ui/Text";

function format2digits(value: number) {
  return value < 10 ? `0${value.toString()}` : value;
}

type Props = {
  seconds: number;
  minutes: number;
};

export default function TimerDisplay({ seconds, minutes }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "16px" }}>
          <Text variant={TextVariantEnum.H5} style={{ color: "#fff" }}>
            <span>{format2digits(minutes)}</span>:<span>{format2digits(seconds)}</span>
          </Text>
        </div>
      </div>
    </div>
  );
}
