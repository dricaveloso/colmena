/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import { getFirstLettersOfTwoFirstNames } from "@/utils/utils";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import Backdrop from "@/components/ui/Backdrop";
import IconButton from "@/components/ui/IconButton";
import { PropsUserSelector } from "@/types/index";
import { useSelector } from "react-redux";

type Props = {
  size: number;
  image?: string | undefined | null;
  name?: string | undefined;
  showEditImage?: boolean;
  type?: "user" | "media";
};

function AvatarChangePicture({
  size,
  name = "",
  image,
  showEditImage = true,
  type = "user",
}: Props) {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      size: {
        width: theme.spacing(size),
        height: theme.spacing(size),
      },
    }),
  );
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const inputFileRef = useRef(null);
  const [showBackdrop, setShowBackdrop] = useState(false);

  const onFileChange = async (e: any) => {
    /* Selected files data can be collected here. */
    setShowBackdrop(true);
    const body = new FormData();
    // body.append("files", e.target.files[0]);
    body.append("user", userRdx.user.id);
    body.append("password", userRdx.user.password);
    try {
      const response = await fetch("/api/create-avatar", {
        method: "POST",
        body,
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      console.log(response);
    } catch (e) {
      console.log(e);
    } finally {
      setShowBackdrop(false);
    }
    console.log(e.target.files);
  };
  const onBtnClick = () => {
    // if (!inputFileRef || !inputFileRef.current) return;
    // inputFileRef?.current?.click();
  };

  const classes = useStyles();

  return (
    <>
      <Backdrop open={showBackdrop} />
      <input type="file" ref={inputFileRef} onChange={onFileChange} style={{ display: "none" }} />
      <Badge
        overlap="circular"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        badgeContent={
          showEditImage ? (
            <IconButton
              handleClick={onBtnClick}
              icon="camera"
              iconColor="#343A40"
              fontSizeIcon="small"
            />
          ) : null
        }
      >
        {!image || !navigator.onLine ? (
          <Avatar className={classes.size}>{getFirstLettersOfTwoFirstNames(name)}</Avatar>
        ) : (
          <Avatar alt={`Avatar ${name}`} src={image} className={classes.size}>
            {getFirstLettersOfTwoFirstNames(name)}
          </Avatar>
        )}
      </Badge>
    </>
  );
}

export default AvatarChangePicture;
