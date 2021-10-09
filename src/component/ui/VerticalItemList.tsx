import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Box from "@material-ui/core/Box";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Image from "next/image";
import { LibraryItemInterface } from "@/interfaces/index";
import IconButton from "@/components/ui/IconButton";
import { useRouter } from "next/router";
import { FileIcon } from "react-file-icon";
import theme from "@/styles/theme";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    width: "100%",
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
  tags,
  type,
  arrayBufferBlob,
  image,
  extension,
}: LibraryItemInterface) => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <Box className={classes.card}>
      <ListItemAvatar
        onClick={() =>
          type === "directory" &&
          router.query.path !== filename &&
          router.push(`/library/${filename}`)
        }
      >
        {image !== undefined ? (
          <Image alt={`image-${basename}-${id}`} width={60} height={60} src={image} />
        ) : (
          <Box width={60} px={1}>
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
        secondary={type}
        onClick={() =>
          type === "directory" &&
          router.query.path !== filename &&
          router.push(`/library/${filename}`)
        }
      />
      <Box className={classes.options}>
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
    </Box>
  );
};

export default VerticalItemList;
