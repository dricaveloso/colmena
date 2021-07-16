import React from "react";
import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/index";

function HeaderApp() {
  return (
    <Box>
      <Text variant={TextVariantEnum.BODY1} gutterBottom>
        Logo
      </Text>
    </Box>
  );
}

export default HeaderApp;
