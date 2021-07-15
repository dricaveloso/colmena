import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Text from "@/components/ui/Text";
import { LibraryItemInterface } from "@/interfaces/index";
import { TextAlignEnum, TextVariantEnum } from "@/enums/index";
import VerticalItemList from "@/components/ui/VerticalItemList";
import { v4 as uuid } from "uuid";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      paddingTop: 0,
      marginTop: 0,
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

type Props = {
  title?: string;
  data: LibraryItemInterface[];
};

export default function VerticalList({ title = "", data }: Props) {
  const classes = useStyles();

  return (
    <>
      {title !== "" && (
        <div style={{ marginTop: 15, marginBottom: 15 }}>
          <Text variant={TextVariantEnum.SUBTITLE2} align={TextAlignEnum.LEFT}>
            {title}
          </Text>
        </div>
      )}
      <List className={classes.root}>
        {data.map((item) => (
          <ListItem key={uuid()} divider disableGutters>
            <VerticalItemList {...item} />
          </ListItem>
        ))}
      </List>
    </>
  );
}
