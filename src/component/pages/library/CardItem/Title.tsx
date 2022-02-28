import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";
import { Box } from "@material-ui/core";
import React from "react";

interface LibraryCardItemTitleInterface {
  title: string | React.ReactNode;
  handleClick?: (event: any) => void | undefined | undefined;
  // eslint-disable-next-line @typescript-eslint/ban-types
  textStyle?: object | undefined;
}

const CardItemTitle = ({ title, textStyle, handleClick }: LibraryCardItemTitleInterface) => (
  <Box onClick={handleClick}>
    <Text variant={TextVariantEnum.BODY1} noWrap style={textStyle}>
      {title}
    </Text>
  </Box>
);

export default CardItemTitle;
