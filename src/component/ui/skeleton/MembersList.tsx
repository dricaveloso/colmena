import React from "react";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles, Typography } from "@material-ui/core";
import { v4 as uuid } from "uuid";

const useStyles = makeStyles(() => ({
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "nowrap",
    width: "100%",
  },
}));

export default function MembersList() {
  const classes = useStyles();
  return (
    <Box display="flex" justifyContent="column">
      {[1, 2, 3].map(() => (
        <Box className={classes.card} key={uuid()} margin={1}>
          <Skeleton variant="circle" width={65} height={65} />
          <Typography variant="body1">
            <Skeleton width={50} />
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
