import React, { useCallback, useEffect, useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { LibraryCardItemInterface, LibraryItemInterface } from "@/interfaces/index";
import Text from "@/components/ui/Text";
import DirectoryList from "@/components/ui/skeleton/DirectoryList";
import IconButton from "@/components/ui/IconButton";
import { v4 as uuid } from "uuid";
import { toast } from "@/utils/notifications";
import { useTranslation } from "next-i18next";
import { hasExclusivePath } from "@/utils/directory";
import { removeCornerSlash } from "@/utils/utils";
import ContextMenuOptions from "../library/contextMenu";
import { ContextMenuOptionEnum } from "@/enums/*";
import { useRouter } from "next/router";
import CardItem from "../library/CardItem";
import { Box, ListItem } from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      flex: 1,
    },
    infiniteScroll: {
      width: "100%",
    },
    shareButton: {
      padding: 0,
      margin: 0,
      minWidth: 30,
    },
  }),
);

type Props = {
  items: LibraryItemInterface[];
  loading: boolean;
  reloadItems: () => void;
};

export default function ListItems({ items, loading, reloadItems }: Props) {
  const [slicedItems, setSlicedItems] = useState<LibraryItemInterface[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const maxItems = 20;
  const classes = useStyles();
  const { t } = useTranslation("librarySearch");
  const { t: c } = useTranslation("common");
  const router = useRouter();

  const unavailable = () => {
    toast(c("featureUnavailable"), "warning");
  };

  const handleContextMenuUpdate = async () => {
    reloadItems();
  };

  const options = (
    cardItem: LibraryCardItemInterface,
    playIconComp: React.ReactNode | undefined = undefined,
  ) => {
    const { filename, basename, type } = cardItem;
    const options = [];
    const shareOption = (
      <IconButton
        key={`${uuid()}-share`}
        icon="share"
        color="#9A9A9A"
        className={classes.shareButton}
        fontSizeIcon="small"
        handleClick={unavailable}
      />
    );

    if (playIconComp) options.push(playIconComp);

    if (!hasExclusivePath(filename) && removeCornerSlash(filename).split("/").length > 1) {
      if (type === "file") {
        options.push(shareOption);
      }

      options.push(
        <ContextMenuOptions
          key={`${basename}-more-options`}
          {...cardItem}
          availableOptions={[
            ContextMenuOptionEnum.EDIT,
            ContextMenuOptionEnum.COPY,
            ContextMenuOptionEnum.MOVE,
            ContextMenuOptionEnum.DOWNLOAD,
            ContextMenuOptionEnum.DELETE,
            ContextMenuOptionEnum.DUPLICATE,
            ContextMenuOptionEnum.RENAME,
          ]}
          onChange={handleContextMenuUpdate}
        />,
      );
    }

    return options;
  };

  const handleItemClick = ({ type, aliasFilename, filename }: LibraryCardItemInterface) => {
    if (type === "directory" && router.query.path !== aliasFilename) {
      router.push(`/library/${aliasFilename}`);
    } else if (type === "file") {
      router.push(`/file/${btoa(filename)}`);
    }
  };

  const getMoreItems = useCallback(() => {
    if (currentPage < totalPages) {
      const newItems = items.slice(0, slicedItems.length + maxItems);
      setSlicedItems(newItems);

      const current = currentPage + 1;
      setCurrentPage(current);
      if (current >= totalPages) {
        setHasMore(false);
      }
    }
  }, [currentPage, totalPages, items, slicedItems.length]);

  useEffect(() => {
    if (items && items.length > 0) {
      setTotalPages(Math.ceil(items.length / maxItems));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    getMoreItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  if (loading) {
    return <DirectoryList />;
  }

  if (items.length === 0) {
    return <Text>{t("messages.folderOrFileNotFound")}</Text>;
  }

  return (
    <Box className={classes.root}>
      <InfiniteScroll
        dataLength={slicedItems.length}
        next={getMoreItems}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        className={classes.infiniteScroll}
      >
        {slicedItems.map((item: LibraryItemInterface) => (
          <ListItem key={item.filename} style={{ padding: 1 }}>
            <CardItem
              subtitle={item.filename}
              handleOpenCard={handleItemClick}
              {...item}
              orientation="vertical"
              options={options}
            />
          </ListItem>
        ))}
      </InfiniteScroll>
    </Box>
  );
}
