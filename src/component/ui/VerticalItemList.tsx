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
  const router = useRouter();

  return (
    <>
      <ListItemAvatar
        onClick={() =>
          type === "directory" &&
          router.query.path !== filename &&
          router.push(`/library/${filename}`)
        }
      >
        {image !== undefined && (
          <Image alt={`image-${basename}-${id}`} width={60} height={60} src={image} />
        )}
        {image === undefined && (
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
        style={{ marginLeft: 5 }}
        primary={basename}
        secondary={type}
        onClick={() =>
          type === "directory" &&
          router.query.path !== filename &&
          router.push(`/library/${filename}`)
        }
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
};

export default VerticalItemList;
