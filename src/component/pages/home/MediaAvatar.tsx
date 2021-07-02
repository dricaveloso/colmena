import React from "react";
import { Avatar } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";

type Props = {
  size: number;
};

function MediaAvatar({ size }: Props) {
  const useStyles = makeStyles((theme) =>
    createStyles({
      size: {
        width: theme.spacing(size),
        height: theme.spacing(size),
      },
    })
  );
  const classes = useStyles();

  return (
    <Avatar
      alt="Remy Sharp"
      src="images/radio_image.jpg"
      className={classes.size}
    />
  );
}

export default MediaAvatar;
