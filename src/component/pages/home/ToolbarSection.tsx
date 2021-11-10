/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import { ButtonVariantEnum, TextVariantEnum } from "@/enums/*";
import Button from "@/components/ui/Button";
import { useTranslation } from "react-i18next";

type Props = {
  title: string;
  link?: string;
  seeAllTitle?: string | undefined;
};

export default function ToolbarSection({ title, link, seeAllTitle }: Props) {
  const { t } = useTranslation("common");
  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
      <Text variant={TextVariantEnum.H6} style={{ color: "#292929", fontWeight: "bold" }}>
        {title}
      </Text>
      <Button
        title={!seeAllTitle ? t("seeAllTitle") : seeAllTitle}
        variant={ButtonVariantEnum.TEXT}
        style={{ color: "#292929" }}
      />
    </Box>
  );
}
