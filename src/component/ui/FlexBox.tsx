import Box from "@material-ui/core/Container";
import {
  FlexDirectionProps,
  AlignItemsProps,
  JustifyContentProps,
  TextAlignProps,
} from "types";
import {
  TextAlignEnum,
  FlexDirectionEnum,
  AlignItemsEnum,
  JustifyContentEnum,
} from "enums";

type Props = {
  textAlign?: TextAlignProps;
  padding?: number;
  flexDirection?: FlexDirectionProps;
  alignItems?: AlignItemsProps;
  justifyContent?: JustifyContentProps;
  extraStyle?: object;
  children: React.ReactNode;
};

export default function Bx({
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
