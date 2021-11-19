import React from "react";
import IconButton from "@/components/ui/IconButton";
import { TextVariantEnum } from "@/enums/index";
import { RecordingInterface } from "@/interfaces/index";

type Props = {
  audio: RecordingInterface;
};

export default function RecordingDoneOptions({ audio }: Props) {
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
        url={audio.audioUrl}
        download={`${audio.title}.opus`}
        fontSizeIcon="medium"
        color="black"
        icon="download"
        variantTitle={TextVariantEnum.BODY2}
        style={{ padding: 0 }}
      />
      <IconButton
        fontSizeIcon="medium"
        color="black"
        icon="share"
        handleClick={faznada}
        variantTitle={TextVariantEnum.BODY2}
        style={{ padding: 0 }}
      />
      <IconButton
        fontSizeIcon="medium"
        color="black"
        icon="more_vertical"
        handleClick={faznada}
        style={{ padding: 0 }}
        variantTitle={TextVariantEnum.BODY2}
      />
    </div>
  );
}
