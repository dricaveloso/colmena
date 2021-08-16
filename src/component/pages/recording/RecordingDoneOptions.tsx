import React from "react";
import IconButton from "@/components/ui/IconButton";
import { TextVariantEnum } from "@/enums/index";

export default function RecordingDoneOptions() {
  const faznada = () => {
    console.log("nad");
  };

  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        top: 0,
        right: 0,
        marginTop: 70,
      }}
    >
      <IconButton
        fontSizeIcon="medium"
        color="black"
        icon="share"
        handleClick={faznada}
        variantTitle={TextVariantEnum.BODY2}
        style={{ paddingRight: 0 }}
      />
      <IconButton
        fontSizeIcon="medium"
        color="black"
        icon="more_vertical"
        handleClick={faznada}
        style={{ paddingLeft: 0 }}
        variantTitle={TextVariantEnum.BODY2}
      />
    </div>
  );
}
