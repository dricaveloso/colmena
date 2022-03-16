/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";
import { Environment } from "@/types/*";
import AudioItemPreview from "@/components/pages/library/AudioFile/AudioItemPreview";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(() => ({
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "nowrap",
    width: "100%",
    backgroundColor: "#fff",
    padding: "16px 8px",
    position: "relative",
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.18)",
    borderRadius: 4,
  },
  description: {
    flexDirection: "column",
    flexGrow: 1,
    alignSelf: "center",

    marginLeft: 5,
    textAlign: "center",
    overflowWrap: "anywhere",
    "& .MuiTypography-body1": {
      overflow: "hidden",
    },
  },
  options: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignSelf: "flex-end",
  },
  topOptions: {
    position: "absolute",
    right: 4,
    top: 8,
  },
  /* bottomOptionsRight: {
    position: "absolute",
    right: 4,
    bottom: 8,
  },
  bottomOptionsLeft: {
    position: "absolute",
    left: 4,
    bottom: 11,
  }, */
  avatar: {
    minHeight: 50,
    display: "flex",
    alignItems: "flex-end",
  },
  title: {
    maxWidth: "100%",
    "& *": {
      maxWidth: "100%",
    },
  },
}));

interface GridItemListInterface {
  avatar?: React.ReactElement;
  primary: string | React.ReactNode;
  primaryFormatted: React.ReactNode;
  secondary?: string | React.ReactNode;
  topOptions?: React.ReactNode;
  bottomOptions?: React.ReactNode;
  handleClick?: (event: any) => void | undefined;
  filename: string;
  basename: string;
  environment: Environment;
  size?: number;
  arrayBufferBlob?: ArrayBuffer | null;
  audioState: "play" | "pause" | "stop";
  handleAudioFinish: () => void;
}

const GridItemList = ({
  avatar,
  primary,
  primaryFormatted,
  secondary,
  topOptions,
  bottomOptions,
  handleClick,
  filename,
  environment,
  size = 0,
  arrayBufferBlob,
  basename,
  audioState,
  handleAudioFinish,
}: GridItemListInterface) => {
  const classes = useStyles();

  return (
    <Box className={classes.card}>
      <Box className={[classes.options, classes.topOptions].join(" ")}>{topOptions}</Box>
      {avatar && <ListItemAvatar className={classes.avatar}>{avatar}</ListItemAvatar>}
      {audioState !== "stop" ? (
        <ListItemText
          className={classes.title}
          data-testid={`library-item-${basename}`}
          style={{ width: "100%" }}
          primary={
            !arrayBufferBlob ? (
              <Box display="flex" flex={1} height={45} justifyContent="center" alignItems="center">
                <CircularProgress size={20} />
              </Box>
            ) : (
              <AudioItemPreview
                primary={primary}
                size={size}
                filename={filename}
                environment={environment}
                type="grid"
                arrayBufferBlob={arrayBufferBlob}
                audioState={audioState}
                handleAudioFinish={handleAudioFinish}
              />
            )
          }
        />
      ) : (
        <ListItemText
          className={classes.title}
          data-testid={`library-item-${basename}`}
          primary={primaryFormatted}
          onClick={handleClick}
        />
      )}

      <Box display="flex" width="100%" alignItems="center" justifyContent="flex-end">
        {Array.isArray(bottomOptions) && bottomOptions[2] && (
          <Box flexGrow={1}>{bottomOptions[2]}</Box>
        )}
        <Box className={[classes.options].join(" ")}>
          {bottomOptions && Array.isArray(bottomOptions) && bottomOptions.slice(0, 2)}
        </Box>
      </Box>
    </Box>
  );
};

export default GridItemList;
