import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";
import AudioItemGrid from "@/components/pages/library/AudioFile/AudioItemGrid";
import { Environment } from "@/types/*";

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
      height: 53,
    },
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
    right: 4,
    top: 8,
  },
  bottomOptions: {
    position: "absolute",
    right: 4,
    bottom: 8,
  },
}));

interface GridItemListInterface {
  avatar?: React.ReactElement;
  primary: string | React.ReactNode;
  secondary?: string | React.ReactNode;
  topOptions?: React.ReactNode;
  bottomOptions?: React.ReactNode;
  isPlaying: boolean;
  handleClick?: (event: any) => void | undefined;
  filename: string;
  environment: Environment;
}

const VerticalItemList = ({
  avatar,
  primary,
  secondary,
  topOptions,
  bottomOptions,
  handleClick,
  isPlaying = false,
}: GridItemListInterface) => {
  const classes = useStyles();

  return (
    <Box className={classes.card}>
      <Box className={[classes.options, classes.topOptions].join(" ")}>{topOptions}</Box>
      {avatar && <ListItemAvatar>{avatar}</ListItemAvatar>}
      {isPlaying ? (
        <ListItemText
          data-testid="title"
          className={classes.description}
          primary={<AudioItemGrid />}
        />
      ) : (
        <ListItemText
          data-testid="title"
          className={classes.description}
          primary={primary}
          secondary={secondary}
          onClick={handleClick}
        />
      )}
      <Box className={[classes.options, classes.bottomOptions].join(" ")}>{bottomOptions}</Box>
    </Box>
  );
};

export default VerticalItemList;
