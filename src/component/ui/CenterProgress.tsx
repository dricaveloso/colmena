import React from "react";
// import LinearProgress from "@material-ui/core/LinearProgress";
import FlexBox from "@/components/ui/FlexBox";
import { AlignItemsEnum, JustifyContentEnum } from "@/enums/index";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function CenterProgress() {
  return (
    <FlexBox
      extraStyle={{ height: "100vh" }}
      justifyContent={JustifyContentEnum.CENTER}
      alignItems={AlignItemsEnum.CENTER}
    >
      <CircularProgress />
    </FlexBox>
  );
}
