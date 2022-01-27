/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import { ButtonVariantEnum, TextVariantEnum } from "@/enums/*";
import Button from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { toast } from "@/utils/notifications";

type Props = {
  title: string;
  link?: string;
  seeAllTitle?: string | undefined;
  showRightButton?: boolean;
};

export default function ToolbarSection({
  title,
  link,
  seeAllTitle,
  showRightButton = true,
}: Props) {
  const { t } = useTranslation("common");
  return (
    <Box
      display="flex"
      marginLeft={2}
      marginRight={2}
      flexDirection="row"
      justifyContent={showRightButton ? "space-between" : "flex-start"}
      alignItems="center"
    >
      <Text variant={TextVariantEnum.H6} style={{ color: "#292929", fontWeight: "bold" }}>
        {title}
      </Text>
      {showRightButton && (
        <Button
          title={!seeAllTitle ? t("seeAllTitle") : seeAllTitle}
          variant={ButtonVariantEnum.TEXT}
          handleClick={() => toast(t("featureUnavailable"), "warning")}
          style={{ color: "#292929" }}
          data-testid="toolbar-click"
        />
      )}
    </Box>
  );
}
