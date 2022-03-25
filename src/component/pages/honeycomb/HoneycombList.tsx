import React, { useState } from "react";
import { RoomItemInterface } from "@/interfaces/talk";
import ListItem from "@material-ui/core/ListItem";
import { v4 as uuid } from "uuid";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";
import { PropsHoneycombSelector } from "@/types/*";
import ArchiveButton from "./ArchiveButton";
import HoneycombListActive from "./HoneycombListActive";
import HoneycombListArchive from "./HoneycombListArchive";

const useStyles = makeStyles(() => ({
  list: {
    textAlign: "left",
    alignItems: "stretch",
  },
  verticalList: {
    padding: "2px 10px",
  },
}));

type Props = {
  data: RoomItemInterface[];
};

export const orderByLastActivity = (a: RoomItemInterface, b: RoomItemInterface) =>
  a.lastActivity - b.lastActivity;

function HoneycombList({ data }: Props) {
  const classes = useStyles();
  const [showArchiveItems, setShowArchiveItems] = useState(false);
  const honeycombRdx = useSelector(
    (state: { honeycomb: PropsHoneycombSelector }) => state.honeycomb,
  );

  const archLength = honeycombRdx.honeycombsArchived.length;

  return (
    <List className={classes.list}>
      {archLength > 0 && (
        <ListItem
          key={uuid()}
          data-testid="archive-honeycomb"
          disableGutters
          className={classes.verticalList}
        >
          <ArchiveButton
            handleClick={() => setShowArchiveItems(!showArchiveItems)}
            back={showArchiveItems}
            amount={archLength}
          />
        </ListItem>
      )}
      {(!showArchiveItems || (showArchiveItems && archLength === 0)) && (
        <HoneycombListActive data={data} />
      )}
      {showArchiveItems && <HoneycombListArchive data={data} />}
    </List>
  );
}

export default HoneycombList;
