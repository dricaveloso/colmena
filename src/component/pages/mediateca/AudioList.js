import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import MoreVertSharpIcon from "@material-ui/icons/MoreVertSharp";

function generate(element) {
  return [0, 1, 2, 3, 4].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

export default function AudioList() {
  return (
    <List dense={true}>
      {generate(
        <>
          <ListItem>
            <ListItemText primary="Single-line item" secondary="Category 1" />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="favorite">
                <BookmarkBorderIcon />
              </IconButton>
              <IconButton edge="end" aria-label="more">
                <MoreVertSharpIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
        </>
      )}
    </List>
  );
}
