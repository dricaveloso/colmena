import React from "react";
import Image from "next/image";
import FlexBox from "@/components/ui/FlexBox";
import { AlignItemsEnum, JustifyContentEnum } from "@/enums/index";

export default function CenterProgress() {
  return (
    <FlexBox
      extraStyle={{ height: "100vh" }}
      justifyContent={JustifyContentEnum.CENTER}
      alignItems={AlignItemsEnum.CENTER}
    >
      <Image src="/images/loader.gif" width={70} height={70} />
    </FlexBox>
  );
}
