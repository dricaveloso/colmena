import React from "react";
import Box from "@material-ui/core/Box";
import SvgIcon from "@/components/ui/SvgIcon";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";
import { useTranslation } from "next-i18next";
import { AllIconProps } from "@/types/*";

type Props = {
  description?: React.ReactNode;
  icon?: AllIconProps;
};

export default function AlertInfoCenter({ icon = "info_circle", description = "" }: Props) {
  const { t } = useTranslation("common");
  return (
    <Box
      display="flex"
      flex="1"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      style={{ height: "80vh" }}
    >
      <SvgIcon icon={icon} htmlColor="#9A9A9A" />
      <Text variant={TextVariantEnum.BODY1} style={{ color: "#9A9A9A", textAlign: "center" }}>
        {t("noItemsFound")}
      </Text>
      {description !== "" && (
        <Text variant={TextVariantEnum.BODY2} style={{ color: "#9A9A9A", textAlign: "center" }}>
          {description}
        </Text>
      )}
    </Box>
  );
}
