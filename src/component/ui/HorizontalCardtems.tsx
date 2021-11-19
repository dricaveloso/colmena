import React from "react";
import Text from "@/components/ui/Text";
import { TextAlignEnum, TextVariantEnum } from "@/enums/index";
import { GenericHorizontalItemInterface } from "@/interfaces/index";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { v4 as uuid } from "uuid";
import VerticalCard from "@/components/ui/VerticalCard";

type Props = {
  title: string;
  data: GenericHorizontalItemInterface[];
};

export default function HorizontalListItems({ title, data }: Props) {
  const theme = useTheme();
  const match = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <div style={{ marginBottom: 20, marginLeft: 8 }}>
      <div style={{ marginTop: 15, marginBottom: 15 }}>
        <Text variant={TextVariantEnum.SUBTITLE2} align={TextAlignEnum.LEFT}>
          {title}
        </Text>
      </div>
      <div className="scrollingContainer" style={!match ? { width: "95vw" } : { width: 600 }}>
        {data.map((item: GenericHorizontalItemInterface) => (
          <div key={uuid()} style={{ marginRight: 15 }}>
            <VerticalCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
