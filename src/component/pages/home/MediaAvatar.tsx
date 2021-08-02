import React from "react";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { getFirstLettersOfTwoFirstNames } from "@/utils/utils";
import { PropsUserSelector } from "@/types/index";

type Props = {
  size: number;
};

function MediaAvatar({ size }: Props) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  const useStyles = makeStyles((theme) => ({
    size: {
      width: theme.spacing(size),
      height: theme.spacing(size),
    },
  }));
  const classes = useStyles();

  if (!userRdx.user.media.image)
    return (
      <Avatar className={classes.size}>
        {getFirstLettersOfTwoFirstNames(userRdx.user?.media.name)}
      </Avatar>
    );

  return (
    <Avatar
      alt="media-avatar"
      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/${userRdx.user?.media.image}`}
      className={classes.size}
    >
      {getFirstLettersOfTwoFirstNames(userRdx.user?.media.name)}
    </Avatar>
  );
}

export default MediaAvatar;
