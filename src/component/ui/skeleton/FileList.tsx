import React from "react";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles, Typography } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { v4 as uuid } from "uuid";

const useStyles = makeStyles(() => ({
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    width: "100%",
    background: "#fff",
    padding: 3,
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
    paddingRight: 15,
  },
}));

export default function FileList() {
  const classes = useStyles();
  return (
    <Box marginTop={2}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => (
        <Box className={classes.card} key={uuid()}>
          <ListItemAvatar style={{ paddingLeft: 10 }}>
            <Skeleton variant="circle" width={40} height={40} />
          </ListItemAvatar>
          <ListItemText
            data-testid="title"
            className={classes.description}
            primary={
              <Typography variant="body1">
                <Skeleton width="50%" />
              </Typography>
            }
            secondary={
              <Typography variant="caption">
                <Skeleton width="80%" />
              </Typography>
            }
          />
          <Box className={classes.options}>
            <Skeleton variant="rect" width={10} height={25} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
