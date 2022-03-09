import Clickable from "@/components/ui/Clickable";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";
import React from "react";

interface LibraryCardItemTitleInterface {
  title: string | React.ReactNode;
  handleClick?: (event: any) => void | undefined | undefined;
  // eslint-disable-next-line @typescript-eslint/ban-types
  textStyle?: object | undefined;
}

const CardItemTitle = ({ title, textStyle, handleClick }: LibraryCardItemTitleInterface) => (
  <Clickable handleClick={handleClick}>
    <Text variant={TextVariantEnum.BODY1} noWrap style={textStyle}>
      {title}
    </Text>
  </Clickable>
);

export default CardItemTitle;
