import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";

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
interface VerticalItemListInterface {
  avatar?: React.ReactNode;
  primary: string | React.ReactNode;
  secondary?: string | React.ReactNode;
  options?: React.ReactNode;
  handleClick?: (event: any) => void | undefined;
}

const VerticalItemList = ({
  avatar,
  primary,
  secondary,
  options,
  handleClick,
}: VerticalItemListInterface) => {
  const classes = useStyles();

  return (
    <Box className={classes.card}>
      <ListItemAvatar>{avatar}</ListItemAvatar>
      <ListItemText
        data-testid="title"
        className={classes.description}
        primary={primary}
        secondary={secondary}
        onClick={handleClick}
      />
      <Box className={classes.options}>{options}</Box>
    </Box>
  );
};

export default VerticalItemList;
