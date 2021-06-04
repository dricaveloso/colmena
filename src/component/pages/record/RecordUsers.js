import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
      flexWrap: "wrap",
    },
    large: {
      width: theme.spacing(8),
      height: theme.spacing(8),
    },
  })
);

export default function RecordUsers() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>
        <Badge color="primary" variant="dot">
          <Avatar alt="Remy Sharp" src="/avatar/1.jpg" />
        </Badge>
        <small style={{ display: "block", marginTop: 5 }}>Makena</small>
      </div>
    </div>
  );
}
