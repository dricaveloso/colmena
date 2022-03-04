import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      width: "100%",
      textAlign: "left",
      padding: "10px 0",
      color: theme.palette.gray.main,
    },
    description: {
      flexGrow: 1,
    },
  }),
);

type Props = {
  totalItems: number;
};

export default function SearchBar({ totalItems }: Props) {
  const { t } = useTranslation("librarySearch");
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Text className={classes.description} variant={TextVariantEnum.SUBTITLE2}>
        {totalItems} {t("itemsFound")}
      </Text>
      {/* <Box>
        <IconButton icon="settings_adjust" fontSizeIcon="small" style={{ minWidth: "auto" }} />
      </Box> */}
    </Box>
  );
}
