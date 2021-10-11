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
import { ListTypeEnum } from "@/enums/*";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "nowrap",
    width: "100%",
    marginBottom: 8,
    backgroundColor: "#fff",
    padding: 8,
    position: "relative",
  },
  description: {
    flexDirection: "column",
    flexGrow: 1,
    alignSelf: "center",
    overflow: "hidden",
    marginLeft: 5,
    textAlign: "center",
  },
  options: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignSelf: "flex-end",
    padding: 4,
  },
  topOptions: {
    position: "absolute",
    right: 0,
  },
  bottomOptions: {
    position: "absolute",
    right: 0,
    bottom: 0,
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

  const handleClick = () => {
    if (type === "directory" && router.query.path !== filename) {
      router.push(`/library/${filename}`);
    }
  };

  return (
    <Box className={classes.card}>
      <Box className={[classes.options, classes.topOptions]}>
        <IconButton
          icon="more_vertical"
          style={{ padding: 0, margin: 0, minWidth: 30 }}
          fontSizeIcon="small"
        />
      </Box>
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
        secondary={type}
        onClick={() => handleClick()}
      />
      <Box className={[classes.options, classes.bottomOptions]}>
        <IconButton
          icon="share"
          style={{ padding: 0, margin: 0, minWidth: 30 }}
          fontSizeIcon="small"
        />
      </Box>
    </Box>
  );
};

export default VerticalItemList;
