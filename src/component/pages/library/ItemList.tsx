import React from "react";
import { LibraryItemInterface } from "@/interfaces/index";
import VerticalItemList from "@/components/ui/VerticalItemList";
import GridItemList from "@/components/ui/GridItemList";
import ListItem from "@material-ui/core/ListItem";
import { v4 as uuid } from "uuid";
import List from "@material-ui/core/List";
import { ListTypeEnum } from "@/enums/*";
import { Box, makeStyles } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
  list: {
    textAlign: "left",
  },
  gridList: {
    width: "50%",
    display: "inline-flex",
  },
  divider: {
    display: "block",
    width: 8,
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
              <ListItem key={uuid()} disableGutters>
                <VerticalItemList {...item} />
              </ListItem>
            ) : (
              <>
                <ListItem key={uuid()} disableGutters className={classes.gridList}>
                  <GridItemList {...item} />
                  <Box className={classes.divider} />
                </ListItem>
              </>
            )}
          </>
        ))}
    </List>
  );
}

export default ItemList;
