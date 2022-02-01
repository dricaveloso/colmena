import React from "react";
import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import { TextAlignEnum, TextVariantEnum } from "@/enums/index";
import theme from "@/styles/theme";

type Props = {
  message: string;
  color?: string;
};

export default function ErrorMessageForm({ message, color = theme.palette.danger.main }: Props) {
  return (
    <Box style={{ width: "100%" }} marginTop={1}>
      <Text style={{ color }} align={TextAlignEnum.LEFT} variant={TextVariantEnum.CAPTION}>
        {message}
      </Text>
    </Box>
  );
}
