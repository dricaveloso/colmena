import React from "react";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

type Props = {
  size: number;
};

function MediaAvatar({ size }: Props) {
  const useStyles = makeStyles((theme) => ({
    size: {
      width: theme.spacing(size),
      height: theme.spacing(size),
    },
  }));
  const classes = useStyles();

  return <Avatar alt="avatar" src="images/radio_image.jpg" className={classes.size} />;
}

export default MediaAvatar;
