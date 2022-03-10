/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import { ButtonVariantEnum, TextVariantEnum } from "@/enums/*";
import Button from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import router from "next/router";
import { makeStyles, createStyles } from "@material-ui/core/styles";

type Props = {
  title: string;
  link?: string;
  seeAllTitle?: string | undefined;
  showRightButton?: boolean;
  noMargin?: boolean;
};

const useStyles = makeStyles(() => ({
  title: {
    color: "#292929",
    fontWeight: "bold",
    textAlign: "left",
  },
  button: {
    color: "#292929",
  },
}));

export default function ToolbarSection({
  title,
  link,
  seeAllTitle,
  showRightButton = true,
  noMargin = false,
}: Props) {
  const goTo = () => {
    if (!link) return;

    router.push(link);
  };
  const { t } = useTranslation("common");
  const classes = useStyles();
  return (
    <Box
      display="flex"
      marginLeft={!noMargin ? 2 : undefined}
      marginRight={!noMargin ? 2 : undefined}
      flexDirection="row"
      justifyContent={showRightButton ? "space-between" : "flex-start"}
      alignItems="center"
    >
      <Text variant={TextVariantEnum.H6} className={classes.title}>
        {title}
      </Text>
      {showRightButton && (
        <Button
          title={!seeAllTitle ? t("seeAllTitle") : seeAllTitle}
          variant={ButtonVariantEnum.TEXT}
          className={classes.button}
          data-testid="toolbar-click"
          handleClick={() => goTo()}
        />
      )}
    </Box>
  );
}
