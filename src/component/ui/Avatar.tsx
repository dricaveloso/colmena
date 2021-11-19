import React from "react";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { getFirstLettersOfTwoFirstNames } from "@/utils/utils";

type Props = {
  size: number;
  image?: string | undefined | null;
  name?: string | undefined;
};

function AvatarAux({ size, name = "", image }: Props) {
  const useStyles = makeStyles((theme) => ({
    size: {
      width: theme.spacing(size),
      height: theme.spacing(size),
    },
  }));
  const classes = useStyles();

  if (!image || !navigator.onLine) {
    return <Avatar className={classes.size}>{getFirstLettersOfTwoFirstNames(name)}</Avatar>;
  }

  return (
    <Avatar alt={`Avatar ${name}`} src={image} className={classes.size}>
      {getFirstLettersOfTwoFirstNames(name)}
    </Avatar>
  );
}

export default AvatarAux;
