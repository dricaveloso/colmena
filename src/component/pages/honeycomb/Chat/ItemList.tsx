import React, { useRef, useEffect } from "react";
import { ChatMessageItemInterface } from "@/interfaces/talk";
import VerticalItemList from "./VerticalItemList";
import ListItem from "@material-ui/core/ListItem";
import { v4 as uuid } from "uuid";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { useSelector } from "react-redux";
import { PropsHoneycombSelector } from "@/types/*";

const useStyles = makeStyles(() => ({
  list: {
    textAlign: "left",
    alignItems: "stretch",
    marginTop: 12,
  },
  verticalList: {
    padding: 1,
  },
}));

function ItemList() {
  const honeycombRdx = useSelector(
    (state: { honeycomb: PropsHoneycombSelector }) => state.honeycomb,
  );

  const classes = useStyles();
  const items = honeycombRdx.chatMessages;
  const footerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    footerRef?.current?.scrollIntoView();
  }, [items]);

  return (
    <Box>
      <List ref={listRef} className={classes.list}>
        {items.length > 0 &&
          items.map((item: ChatMessageItemInterface, idx: number) => (
            <ListItem key={uuid()} disableGutters className={classes.verticalList}>
              <VerticalItemList prevItem={items[idx - 1] ? items[idx - 1] : null} item={item} />
            </ListItem>
          ))}
        <ListItem key={uuid()} disableGutters>
          <div ref={footerRef} style={{ width: "100%", height: 50 }}></div>
        </ListItem>
      </List>
    </Box>
  );
}

export default ItemList;
