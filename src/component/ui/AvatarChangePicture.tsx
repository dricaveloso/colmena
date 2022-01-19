import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { getFirstLettersOfTwoFirstNames } from "@/utils/utils";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import SvgIcon from "@/components/ui/SvgIcon";

type Props = {
  size: number;
  image?: string | undefined | null;
  name?: string | undefined;
};

function AvatarChangePicture({ size, name = "", image }: Props) {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      size: {
        width: theme.spacing(size),
        height: theme.spacing(size),
      },
    }),
  );

  const classes = useStyles();

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      badgeContent={<SvgIcon icon="camera" fontSize="medium" />}
    >
      {!image || !navigator.onLine ? (
        <Avatar className={classes.size}>{getFirstLettersOfTwoFirstNames(name)}</Avatar>
      ) : (
        <Avatar alt={`Avatar ${name}`} src={image} className={classes.size}>
          {getFirstLettersOfTwoFirstNames(name)}
        </Avatar>
      )}
    </Badge>
  );
}

export default AvatarChangePicture;
