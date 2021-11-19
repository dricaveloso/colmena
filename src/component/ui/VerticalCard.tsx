import React from "react";
import { Card } from "@material-ui/core";
import Text from "@/components/ui/Text";
import { TextAlignEnum, TextColorEnum, TextVariantEnum } from "@/enums/index";
import { GenericHorizontalItemInterface } from "@/interfaces/index";
import Image from "next/image";
import Link from "next/link";

function VerticalCard({ srcImg, title, subtitle, url }: GenericHorizontalItemInterface) {
  return (
    <Link href={url}>
      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
        }}
      >
        <div>
          <Image width={150} height={150} src={srcImg} />
        </div>
        <div style={{ whiteSpace: "normal", padding: 10 }}>
          <Text
            variant={TextVariantEnum.H4}
            align={TextAlignEnum.LEFT}
            style={{
              fontSize: 14,
            }}
            color={TextColorEnum.TEXTPRIMARY}
          >
            {title}
          </Text>
          <Text
            align={TextAlignEnum.LEFT}
            variant={TextVariantEnum.BODY1}
            style={{
              fontSize: 12,
            }}
            color={TextColorEnum.TEXTSECONDARY}
          >
            {subtitle}
          </Text>
        </div>
      </Card>
    </Link>
  );
}

export default VerticalCard;
