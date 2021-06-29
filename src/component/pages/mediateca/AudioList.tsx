import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import MoreVertSharpIcon from "@material-ui/icons/MoreVertSharp";

export default function AudioList({ data }) {
  return (
    <List dense={true}>
      {data.map((item, idx) => (
        <>
          <ListItem key={idx}>
            <ListItemText primary={item.name} secondary={item.category.name} />
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
      ))}
    </List>
  );
}