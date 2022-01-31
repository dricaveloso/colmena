/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import { getFirstLettersOfTwoFirstNames } from "@/utils/utils";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import SvgIcon from "@/components/ui/SvgIcon";
import { v4 as uuid } from "uuid";
import { listFile } from "@/services/webdav/files";
import { PropsUserSelector } from "@/types/index";
import { useSelector } from "react-redux";
import { ConfigFilesNCEnum } from "@/enums/*";
import Loading from "@/components/ui/Loading";
import { arrayBufferToBlob, blobToDataURL } from "blob-util";

type Props = {
  size: number;
  mediaName: string;
  showEditImage?: boolean;
};

function AvatarAux({ size, showEditImage = false, mediaName = "" }: Props) {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      size: {
        width: theme.spacing(size),
        height: theme.spacing(size),
      },
    }),
  );
  const [file, setFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  const init = async () => {
    try {
      setLoading(true);
      const blobRes: any = await listFile(
        userRdx.user.id,
        `${mediaName}/${ConfigFilesNCEnum.MEDIA_PROFILE_AVATAR}`,
      );
      const blob = await arrayBufferToBlob(blobRes);
      const file = await blobToDataURL(blob);
      setFile(file);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const classes = useStyles();

  if (loading) return <Loading />;

  if (!file)
    return (
      <Avatar alt={`Media avatar ${mediaName}`} className={classes.size}>
        {getFirstLettersOfTwoFirstNames(mediaName)}
      </Avatar>
    );

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
        <Avatar className={classes.size}>{getFirstLettersOfTwoFirstNames(mediaName)}</Avatar>
      ) : (
        <Avatar alt={`Media avatar ${mediaName}`} src={file} className={classes.size}>
          {getFirstLettersOfTwoFirstNames(mediaName)}
        </Avatar>
      )}
    </Badge>
  );
}

export default AvatarAux;
