import React from "react";
import { RoomItemInterface } from "@/interfaces/talk";
import VerticalItemList from "./VerticalItemList";
import ListItem from "@material-ui/core/ListItem";
import { v4 as uuid } from "uuid";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";
import { PropsHoneycombSelector } from "@/types/*";

const useStyles = makeStyles(() => ({
  list: {
    textAlign: "left",
    alignItems: "stretch",
  },
  verticalList: {
    padding: "2px 10px",
  },
}));

function ItemList() {
  const classes = useStyles();
  const honeycombRdx = useSelector(
    (state: { honeycomb: PropsHoneycombSelector }) => state.honeycomb,
  );

  const items = honeycombRdx.honeycombs;

  return (
    <List className={classes.list}>
      {items.length > 0 &&
        items.map((item: RoomItemInterface) => (
          <ListItem key={uuid()} disableGutters className={classes.verticalList}>
            <VerticalItemList data={item} />
          </ListItem>
        ))}
    </List>
  );
}

export default ItemList;
