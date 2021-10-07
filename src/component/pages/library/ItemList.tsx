import React from "react";
import { LibraryItemInterface } from "@/interfaces/index";
import VerticalItemList from "@/components/ui/VerticalItemList";
import ListItem from "@material-ui/core/ListItem";
import { v4 as uuid } from "uuid";
import List from "@material-ui/core/List";

type Props = {
  items: LibraryItemInterface[];
};

function ItemList({ items = [] }: Props) {
  return (
    <List>
      {items.length > 0 &&
        items.map((item: LibraryItemInterface) => (
          <ListItem key={uuid()} divider disableGutters>
            <VerticalItemList {...item} />
          </ListItem>
        ))}
    </List>
  );
}

export default ItemList;
