import React from "react";
import { makeStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import SvgIcon from "@/components/ui/SvgIcon";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";
import theme from "@/styles/theme";
import { useTranslation } from "next-i18next";
import Clickable from "@/components/ui/Clickable";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    width: "100%",
    background: "#fff",
    padding: 4,
    borderRadius: 5,
    border: `1px solid #e2e2e2`,
    justifyContent: "space-between",
  },
  cardContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: 10,
    alignContent: "center",
    alignItems: "center",
  },
  archivedTitle: {
    color: theme.palette.primary.dark,
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  amountTitle: {
    color: theme.palette.primary.dark,
    fontSize: 12,
    borderRadius: "50%",
    width: 20,
    height: 20,
    backgroundColor: "#DEDEDE",
    textAlign: "center",
    marginRight: 10,
  },
}));

type Props = {
  handleClick: () => void;
  back: boolean;
  amount: number;
};

export default function ArchiveButton({ handleClick, back = false, amount }: Props) {
  const { t } = useTranslation("honeycomb");
  const classes = useStyles();

  return (
    <Box className={classes.card}>
      <Clickable handleClick={handleClick}>
        <Box className={classes.cardContainer}>
          <SvgIcon
            icon={`${!back ? "archive" : "back"}`}
            htmlColor={theme.palette.primary.dark}
            style={{ fontSize: back ? 24 : 60 }}
          />
          <Text variant={TextVariantEnum.CAPTION} className={classes.archivedTitle}>
            {t("archivedTitle")}
          </Text>
        </Box>
      </Clickable>
      <Text variant={TextVariantEnum.CAPTION} className={classes.amountTitle}>
        {amount}
      </Text>
    </Box>
  );
}
