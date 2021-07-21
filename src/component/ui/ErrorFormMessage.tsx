import React from "react";
import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import { TextColorEnum, TextAlignEnum, TextVariantEnum } from "@/enums/index";

type Props = {
  message: string;
};

export default function ErrorMessageForm({ message }: Props) {
  return (
    <Box style={{ width: "100%" }} marginTop={1}>
      <Text
        color={TextColorEnum.ERROR}
        align={TextAlignEnum.LEFT}
        variant={TextVariantEnum.CAPTION}
      >
        {message}
      </Text>
    </Box>
  );
}
