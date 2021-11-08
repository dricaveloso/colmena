/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Box from "@material-ui/core/Box";
import Image from "next/image";
import { LibraryItemInterface } from "@/interfaces/index";
import IconButton from "@/components/ui/IconButton";
import { useRouter } from "next/router";
import { FileIcon } from "react-file-icon";
import theme from "@/styles/theme";
import { makeStyles } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles(() => ({
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    width: "100%",
    background: "#fff",
    padding: 8,
  },
  description: {
    flexDirection: "column",
    flexGrow: 1,
    alignSelf: "stretch",
    overflow: "hidden",
    marginLeft: 5,
  },
  options: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
  },
}));

const VerticalItemList = ({
  id,
  basename,
  filename,
  environment,
  createdAt,
  createdAtDescription,
  tags,
  type,
  arrayBufferBlob,
  image,
  extension,
}: LibraryItemInterface) => {
  const classes = useStyles();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenContextMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseContextMenu = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {
    if (type === "directory" && router.query.path !== filename) {
      router.push(`/library/${filename}`);
    }
  };

  // const handleDeleteItem = () => {

  // }

  return (
    <Box className={classes.card}>
      <ListItemAvatar>
        {image !== undefined ? (
          <Image
            alt={`image-${basename}-${id}`}
            width={60}
            height={60}
            src={image}
            onClick={() => handleClick()}
          />
        ) : (
          <Box width={60} px={1} onClick={() => handleClick()}>
            <FileIcon
              extension={extension}
              foldColor={theme.palette.primary.dark}
              glyphColor="#fff"
              color={theme.palette.primary.main}
              labelColor={theme.palette.primary.dark}
            />
          </Box>
        )}
      </ListItemAvatar>
      <ListItemText
        data-testid="title"
        className={classes.description}
        primary={basename}
        secondary={createdAtDescription}
        onClick={() => handleClick()}
      />
      <Box className={classes.options}>
        <IconButton
          icon="share"
          color="#9A9A9A"
          style={{ padding: 0, margin: 0, minWidth: 30 }}
          fontSizeIcon="small"
        />
        <IconButton
          icon="more_vertical"
          color="#9A9A9A"
          style={{ padding: 0, margin: 0, minWidth: 30 }}
          fontSizeIcon="small"
          handleClick={handleOpenContextMenu}
        />
      </Box>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseContextMenu}
      >
        {type === "file" && <MenuItem onClick={handleCloseContextMenu}>Edit</MenuItem>}
        <MenuItem onClick={handleCloseContextMenu}>Copy</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Move</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Duplicate</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Download</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Rename</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Details</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Synchronize</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Publish</MenuItem>
        <MenuItem onClick={handleCloseContextMenu}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default VerticalItemList;
