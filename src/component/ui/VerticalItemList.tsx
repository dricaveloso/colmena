import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";
import { VerticalItemListInterface } from "@/interfaces/index";
import AudioItemPreview from "@/components/pages/library/AudioFile/AudioItemPreview";
import { basename } from "path";

const useStyles = makeStyles(() => ({
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    width: "100%",
    background: "#fff",
    padding: 8,
    borderRadius: 5,
    border: "1px solid #eee",
  },
  description: {
    flexDirection: "column",
    flexGrow: 1,
    alignSelf: "stretch",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginLeft: 5,
  },
  options: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  avatar: {
    minHeight: 50,
    display: "flex",
    alignItems: "center",
  },
}));

const VerticalItemList = (cardItem: VerticalItemListInterface) => {
  const {
    avatar,
    primary,
    secondary,
    options,
    handleClick,
    isPlaying = false,
    filename,
    environment,
    size = 0,
    arrayBufferBlob,
  } = cardItem;
  const classes = useStyles();

  return (
    <Box className={classes.card}>
      {avatar && <ListItemAvatar className={classes.avatar}>{avatar}</ListItemAvatar>}
      {isPlaying ? (
        <ListItemText
          data-testid={`library-item-${basename}`}
          className={classes.description}
          onClick={handleClick}
          primary={
            <AudioItemPreview
              primary={primary}
              size={size}
              filename={filename}
              environment={environment}
              type="vertical"
              arrayBufferBlob={arrayBufferBlob}
            />
          }
        />
      ) : (
        <ListItemText
          data-testid={`library-item-${basename}`}
          className={classes.description}
          primary={primary}
          secondary={secondary}
        />
      )}
      <Box className={classes.options}>{options}</Box>
    </Box>
  );
};

export default VerticalItemList;
