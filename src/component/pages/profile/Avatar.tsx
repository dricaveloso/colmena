/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { getFirstLettersOfTwoFirstNames } from "@/utils/utils";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import { PropsUserSelector } from "@/types/index";
import { useSelector } from "react-redux";
import SvgIcon from "@/components/ui/SvgIcon";
import getConfig from "next/config";
import { v4 as uuid } from "uuid";

const { publicRuntimeConfig } = getConfig();

type Props = {
  size: number;
  userId?: string;
  userName?: string;
  showEditImage?: boolean;
};

function AvatarAux({ size, showEditImage = false, userId = "", userName = "" }: Props) {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      size: {
        width: theme.spacing(size),
        height: theme.spacing(size),
      },
    }),
  );
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const usrId = !userId ? userRdx.user.id : userId;
  const usrName = !userName ? userRdx.user.name : userName;

  const classes = useStyles();

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      badgeContent={
        showEditImage ? <SvgIcon icon="edit_circle" htmlColor="#fff" fontSize="small" /> : null
      }
    >
      {!navigator.onLine ? (
        <Avatar className={classes.size}>{getFirstLettersOfTwoFirstNames(usrName)}</Avatar>
      ) : (
        <Avatar
          alt={`Avatar ${usrName}`}
          src={`${publicRuntimeConfig.api.baseUrl}/avatar/${usrId}/100?uuid=${uuid()}`}
          className={classes.size}
        >
          {getFirstLettersOfTwoFirstNames(usrName)}
        </Avatar>
      )}
    </Badge>
  );
}

export default AvatarAux;

export const AvatarMemoized = React.memo(AvatarAux);
