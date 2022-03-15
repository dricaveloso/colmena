import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import SectionTitle from "@/components/pages/library-search/SectionTitle";
import Chip from "@material-ui/core/Chip";
import { useTranslation } from "next-i18next";
import { LibraryItemInterface } from "@/interfaces/index";
import { TagInterface } from "@/interfaces/tags";
import { ButtonSizeEnum } from "@/enums/*";
import Button from "@/components/ui/Button";
import { useRouter } from "next/router";

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
    tags: {
      overflow: "auto",
      width: "100%",
      padding: "10px 0",
    },
    tagRow: {
      display: "flex",
      flexWrap: "nowrap",
    },
    tagItem: {
      marginBottom: 7,
      backgroundColor: "#fff",
      border: `1px solid ${theme.palette.gray.main}`,
      color: theme.palette.gray.dark,
    },
    activeTag: {
      backgroundColor: theme.palette.primary.main,
      color: "#fff",
      borderColor: "#fff",
    },
    sectionTitle: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    clearButton: {
      backgroundColor: `${theme.palette.gray.dark} !important`,
      color: theme.palette.gray.contrastText,
      display: "inline-block",
      borderRadius: 15,
      textTransform: "initial",
      padding: 2,
    },
  }),
);

type Props = {
  keyword?: string;
  rawTags?: TagInterface[];
  rawItems?: LibraryItemInterface[];
  currentTag?: string;
  openTag?: (tag: TagInterface) => void;
};

export default function Tags({ rawTags, rawItems, currentTag, openTag }: Props) {
  const router = useRouter();
  const [tags, setTags] = useState<Array<TagInterface[]>>([]);
  const { t } = useTranslation("librarySearch");
  const classes = useStyles();

  const handleOpenTag = (tag: TagInterface) => {
    if (typeof openTag === "function") {
      openTag(tag);
    }
  };

  const getTagsOnlyFileExists = (tags: TagInterface[], items: LibraryItemInterface[]) =>
    tags.filter(
      (tag: TagInterface) =>
        items.filter(
          (item: LibraryItemInterface) =>
            tag.fileName.replace(/(.+?files\/|^files\/)/, "") === item.filename,
        ).length > 0,
    );

  const orderTags = (tags: TagInterface[]) => {
    // eslint-disable-next-line no-confusing-arrow
    tags.sort((a: TagInterface, b: TagInterface) =>
      // eslint-disable-next-line prettier/prettier
      b?.quantity && a?.quantity && b.quantity > a.quantity ? 1 : -1,
    );

    return tags;
  };

  const mergeUniqueTags = (tags: TagInterface[]) => {
    const mergedTags: TagInterface[] = [];
    tags.forEach((tag) => {
      const mergedTag = mergedTags.find((mergedTag) => mergedTag.tagName === tag.tagName);
      if (mergedTag) {
        if (mergedTag.quantity) mergedTag.quantity += 1;
      } else {
        mergedTags.push({ ...tag, quantity: 1 });
      }
    });

    return mergedTags;
  };

  const handleTags = (tags: TagInterface[], items: LibraryItemInterface[]) => {
    const mergedTags = orderTags(mergeUniqueTags(getTagsOnlyFileExists(tags, items)));
    const totalRows = mergedTags.length > 10 ? 2 : 1;
    const totalTags = Math.ceil(mergedTags.length / totalRows);
    const slicedTags: Array<TagInterface[]> = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < totalRows; i++) {
      const initialPosition = totalTags * i;
      const finalPosition = i > 0 ? totalTags * i + totalTags : totalTags;
      slicedTags.push(mergedTags.slice(initialPosition, finalPosition));
    }

    setTags(slicedTags);
  };

  const clear = () => {
    router.push(`/search`);
  };

  useEffect(() => {
    if (rawTags && rawItems) {
      handleTags(rawTags, rawItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawTags, rawItems]);

  if (!tags[0] || tags[0].length === 0) {
    return null;
  }

  return (
    <Box className={classes.root}>
      <SectionTitle className={classes.sectionTitle}>
        {t("searchByTags")}
        {currentTag && (
          <Button
            title={t("clear")}
            size={ButtonSizeEnum.SMALL}
            className={classes.clearButton}
            handleClick={clear}
          />
        )}
      </SectionTitle>
      <Box className={classes.tags}>
        {tags.map((row) => (
          <Box className={classes.tagRow} key={uuid()}>
            {row.map((tag) => (
              <Chip
                clickable
                onClick={() => handleOpenTag(tag)}
                key={uuid()}
                className={[
                  classes.tagItem,
                  tag.tagId === currentTag ? classes.activeTag : undefined,
                ].join(" ")}
                label={
                  <Box component="span" display="flex" flexDirection="row">
                    {tag.tagName.toString().toLowerCase()}
                  </Box>
                }
                style={{ marginRight: 5 }}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
