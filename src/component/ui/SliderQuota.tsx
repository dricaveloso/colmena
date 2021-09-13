import React from "react";
import Slider from "@material-ui/core/Slider";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";

export default function DiscreteSlider() {
  return (
    <div>
      <Text variant={TextVariantEnum.CAPTION} style={{ color: "#51b495" }}>
        Usado 16GB (60%)
      </Text>
      <Slider
        style={{ color: "#51b495" }}
        defaultValue={60}
        aria-labelledby="discrete-slider-restrict"
        step={null}
        min={0}
        max={100}
        disabled
        valueLabelDisplay="off"
        marks={false}
      />
    </div>
  );
}
