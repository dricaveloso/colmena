import React from "react";
import Box from "@material-ui/core/Container";
import { FlexDirectionProps, AlignItemsProps, JustifyContentProps, TextAlignProps } from "types";
import { TextAlignEnum, FlexDirectionEnum, AlignItemsEnum, JustifyContentEnum } from "enums";

type Props = {
  key?: number;
  textAlign?: TextAlignProps;
  padding?: number;
  flexDirection?: FlexDirectionProps;
  alignItems?: AlignItemsProps;
  justifyContent?: JustifyContentProps;
  // eslint-disable-next-line @typescript-eslint/ban-types
  extraStyle?: object;
  children: React.ReactNode;
};

export default function Bx({
  key = 1,
  textAlign = TextAlignEnum.CENTER,
  padding = 10,
  flexDirection = FlexDirectionEnum.COLUMN,
  alignItems = AlignItemsEnum.CENTER,
  justifyContent = JustifyContentEnum.SPACEBETWEEN,
  extraStyle = {},
  children,
}: Props) {
  return (
    <Box
      key={key}
      style={{
        textAlign,
        padding,
        display: "flex",
        flex: 1,
        flexDirection,
        justifyContent,
        alignItems,
        marginBottom: 10,
        marginTop: 4,
        ...extraStyle,
      }}
    >
      <>{children}</>
    </Box>
  );
}
