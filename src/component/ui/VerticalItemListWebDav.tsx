import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Box from "@material-ui/core/Box";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Image from "next/image";
import { LibraryItemInterface, LibraryItemWebDavInterface } from "@/interfaces/index";
import IconButton from "@/components/ui/IconButton";
import { FileIcon, defaultStyles } from "react-file-icon";

function getExtesionFilename(filename: string) {
  return filename.substring(filename.lastIndexOf(".") + 1, filename.length) || filename;
}
const VerticalItemList = ({
  filename,
  basename,
  type,
  size,
  lastmod,
}: LibraryItemWebDavInterface) => (
  <>
    <ListItemAvatar style={{ width: 35, height: 35 }}>
      <FileIcon
        extension={getExtesionFilename(filename)}
        {...defaultStyles[getExtesionFilename(filename)]}
      />
    </ListItemAvatar>

    <ListItemText
      data-testid="title"
      style={{ marginLeft: 5 }}
      primary={basename}
      secondary={lastmod}
    />
    <ListItemSecondaryAction>
      <Box display="flex" flexDirection="row" style={{ marginRight: -10 }}>
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
