import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Box from "@material-ui/core/Box";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Image from "next/image";
import { LibraryItemInterface } from "@/interfaces/index";
import IconButton from "@/components/ui/IconButton";

const VerticalItemList = ({ id, title, subtitle = "", img = "" }: LibraryItemInterface) => (
  <>
    {img !== "" && (
      <ListItemAvatar>
        <Image alt={`image-${title}-${id}`} width={60} height={60} src={img} />
      </ListItemAvatar>
    )}
    <ListItemText
      data-testid="title"
      style={{ marginLeft: 5 }}
      primary={title}
      secondary={subtitle}
    />
    <ListItemSecondaryAction style={{ marginRight: -20 }}>
      <Box display="flex" flexDirection="row">
        <IconButton
          icon="share"
          style={{ padding: 0, margin: 0, minWidth: 30 }}
          fontSizeIcon="small"
        />
        <IconButton
          icon="more_vertical"
          style={{ padding: 0, margin: 0, minWidth: 30 }}
          fontSizeIcon="small"
        />
      </Box>
    </ListItemSecondaryAction>
  </>
);

export default VerticalItemList;
