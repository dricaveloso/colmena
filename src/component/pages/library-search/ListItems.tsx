import React from "react";
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
import { ListItem } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
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
  const classes = useStyles();
  const { t } = useTranslation("librarySearch");
  const { t: c } = useTranslation("common");
  const router = useRouter();

  if (loading) {
    return <DirectoryList />;
  }

  if (items.length === 0) {
    return <Text>{t("messages.folderOrFileNotFound")}</Text>;
  }

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

  return (
    <>
      {items.map((item: LibraryItemInterface) => (
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
    </>
  );
}
