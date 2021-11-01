import React from "react";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 4,
    borderRadius: 5,
    marginTop: 8,
  },
  bar: {
    borderRadius: 5,
  },
}))(LinearProgress);

export default function DiscreteSlider() {
  return (
    <div>
      <Text variant={TextVariantEnum.CAPTION} style={{ color: "#666" }}>
        Usado 16GB (60%)
      </Text>
      <BorderLinearProgress variant="determinate" color="secondary" value={60} />
    </div>
  );
}
