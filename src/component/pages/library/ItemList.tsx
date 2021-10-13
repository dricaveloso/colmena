import React from "react";
import { LibraryItemInterface } from "@/interfaces/index";
import VerticalItemList from "@/components/ui/VerticalItemList";
import GridItemList from "@/components/ui/GridItemList";
import ListItem from "@material-ui/core/ListItem";
import { v4 as uuid } from "uuid";
import List from "@material-ui/core/List";
import { ListTypeEnum } from "@/enums/*";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  list: {
    textAlign: "left",
    alignItems: "stretch",
  },
  gridList: {
    width: "50%",
    display: "inline-flex",
    padding: 4,
  },
  verticalList: {
    padding: 1,
  },
}));

type Props = {
  items: LibraryItemInterface[];
  type: ListTypeEnum;
};

function ItemList({ items = [], type = ListTypeEnum.LIST }: Props) {
  const classes = useStyles();

  return (
    <List className={classes.list}>
      {items.length > 0 &&
        items.map((item: LibraryItemInterface) => (
          <>
            {type === ListTypeEnum.LIST ? (
              <ListItem key={uuid()} disableGutters className={classes.verticalList}>
                <VerticalItemList {...item} />
              </ListItem>
            ) : (
              <>
                <ListItem key={uuid()} disableGutters className={classes.gridList}>
                  <GridItemList {...item} />
                </ListItem>
              </>
            )}
          </>
        ))}
    </List>
  );
}

export default ItemList;
