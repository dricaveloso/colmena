import React from "react";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles, Typography } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { v4 as uuid } from "uuid";

const useStyles = makeStyles(() => ({
  base: {
    width: "100%",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    width: "100%",
    background: "#fff",
    padding: 3,
    borderRadius: 2,
    marginBottom: 4,
  },
  description: {
    flexDirection: "column",
    overflow: "hidden",
    marginLeft: 5,
    alignItems: "center",
  },
  options: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    paddingRight: 15,
  },
}));

export default function DirectoryList({ quantity = 3 }: { quantity?: number }) {
  const classes = useStyles();
  return (
    <Box className={classes.base}>
      {Array.from({ length: quantity }).map(() => (
        <Box className={classes.card} key={uuid()}>
          <ListItemAvatar style={{ paddingLeft: 10 }}>
            <Skeleton width={40} height={64} />
          </ListItemAvatar>
          <ListItemText
            data-testid="title"
            className={classes.description}
            primary={
              <Typography variant="body1">
                <Skeleton width="80%" />
              </Typography>
            }
            secondary={
              <Typography variant="caption">
                <Skeleton width="50%" />
              </Typography>
            }
          />
          <Box className={classes.options}>
            <Skeleton variant="rect" width={25} height={25} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
