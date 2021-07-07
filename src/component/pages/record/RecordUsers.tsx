import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import { v4 as uuid } from "uuid";

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
  }),
);

export default function RecordUsers() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>
        <Badge color="primary" variant="dot">
          <Avatar alt="Remy Sharp" src="/avatar/3.jpg" className={classes.large} />
        </Badge>
        <small style={{ display: "block", marginTop: 5 }}>Makena</small>
      </div>
      {[0, 1].map(() => (
        <div key={uuid()}>
          <Badge color="secondary" variant="dot">
            <Avatar alt="Remy Sharp" src="/avatar/2.jpg" className={classes.large} />
          </Badge>
          <small style={{ display: "block", marginTop: 5 }}>Makena</small>
        </div>
      ))}
    </div>
  );
}
