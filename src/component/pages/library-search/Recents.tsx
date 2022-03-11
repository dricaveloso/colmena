import React from "react";
import { v4 as uuid } from "uuid";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Box, useTheme } from "@material-ui/core";
import SectionTitle from "@/components/pages/library-search/SectionTitle";
import { useTranslation } from "next-i18next";
import SvgIconAux from "@/components/ui/SvgIcon";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { ButtonSizeEnum } from "@/enums/*";
import IconButton from "@/components/ui/IconButton";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      width: "100%",
      textAlign: "left",
      margin: "10px 0",
    },
    keywords: {
      display: "flex",
      flexDirection: "column",
    },
    keywordContent: {
      display: "flex",
      flexDirection: "row",
      margin: "5px 0",
      alignItems: "center",
    },
    keyword: {
      flexGrow: 1,
      padding: "0 10px",
      color: theme.palette.gray.main,
    },
    clearButton: {
      backgroundColor: `${theme.palette.gray.dark} !important`,
      color: theme.palette.gray.contrastText,
      display: "inline-block",
      borderRadius: 15,
      textTransform: "initial",
    },
    recentsFooter: {
      textAlign: "center",
    },
    arrowUpIcon: {
      minWidth: "auto",
    },
  }),
);

type Props = {
  keywords: Array<string>;
  clearRecentSearches: () => void;
  searchByKeyword: (keyword: string) => void;
};

export default function Recents({ keywords, clearRecentSearches, searchByKeyword }: Props) {
  const { t } = useTranslation("librarySearch");
  const classes = useStyles();
  const theme = useTheme();

  if (keywords.length === 0) {
    return null;
  }

  return (
    <Box className={classes.root}>
      <SectionTitle>{t("recentSearches")}</SectionTitle>
      <Box className={classes.keywords}>
        {keywords.map((keyword) => (
          <Box key={uuid()} className={classes.keywordContent}>
            <SvgIconAux
              icon="recently_viewed"
              fontSize="small"
              htmlColor={theme.palette.gray.main}
            />
            <Text className={classes.keyword}>{keyword}</Text>
            <IconButton
              handleClick={() => searchByKeyword(keyword)}
              icon="arrow_up_left"
              fontSizeIcon={15}
              iconColor={theme.palette.gray.main}
              className={classes.arrowUpIcon}
            />
          </Box>
        ))}
      </Box>
      <Box className={classes.recentsFooter}>
        <Button
          title={t("clearRecentSearches")}
          className={classes.clearButton}
          size={ButtonSizeEnum.SMALL}
          handleClick={clearRecentSearches}
        />
      </Box>
    </Box>
  );
}
