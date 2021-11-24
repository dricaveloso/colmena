import React from "react";
import { EnvironmentEnum } from "@/enums/*";
import theme from "@/styles/theme";
import SvgIcon from "@/components/ui/SvgIcon";
import { makeStyles } from "@material-ui/core";
import { AllIconProps } from "@/types/index";

const useStyles = makeStyles(() => ({
  root: {
    position: "relative",
    "& .MuiSvgIcon-fontSizeLarge": {
      fontSize: "3rem",
      width: "inherit",
      height: "inherit",
    },
  },

  folderSecondIcon: {
    display: "flex",
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  fileExtension: {
    position: "absolute",
    top: "50%",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    width: "100%",
    marginTop: "-10px",
    height: "20px",
    lineHeight: "20px",
    verticalAlign: "middle",
    textTransform: "uppercase",
    fontFamily: "tahoma, arial",
  },
  fileSecondIcon: {
    display: "flex",
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
}));

type Props = {
  type: string | ["file", "directory"];
  iconColor?: string | undefined;
  iconTextColor?: string | undefined;
  mime?: string | undefined;
  extension?: string | undefined;
  environment?: EnvironmentEnum | undefined;
  folderSecondIcon?: AllIconProps | null | undefined;
};

export default function FileIcon({
  type,
  iconColor,
  iconTextColor,
  mime,
  extension,
  folderSecondIcon,
}: Props) {
  const classes = useStyles();
  let icon: AllIconProps = "folder";
  if (type === "file") {
    icon = "file";
  }
  let extensionDescription: string | null | undefined = null;
  let fileSecondIcon: AllIconProps | null | undefined = null;

  switch (type) {
    case "directory":
      folderConfig();
      break;
    case "file":
      fileConfig();
      break;
    default:
      break;
  }

  function folderConfig() {
    fileSecondIcon = null;
  }

  function fileConfig() {
    extensionDescription = extension;
    if (mime) {
      const splitMime = mime.split("/");
      const firstName = splitMime[0];
      // const lastName = splitMime[1];
      switch (firstName) {
        case "image":
          fileSecondIcon = "art_gallery";
          break;
        case "audio":
          fileSecondIcon = "music";
          break;
        default:
          break;
      }
    }
  }

  return (
    <div className={classes.root}>
      {folderSecondIcon && (
        <div className={classes.folderSecondIcon}>
          <SvgIcon icon={folderSecondIcon} htmlColor={iconTextColor ?? "#fff"} fontSize="small" />
        </div>
      )}
      {!fileSecondIcon && extensionDescription && (
        <div className={classes.fileExtension} style={{ color: iconTextColor ?? "#fff" }}>
          {extensionDescription}
        </div>
      )}
      {fileSecondIcon && (
        <div className={classes.fileSecondIcon}>
          <SvgIcon icon={fileSecondIcon} htmlColor={iconTextColor ?? "#fff"} fontSize="small" />
        </div>
      )}
      <SvgIcon icon={icon} htmlColor={iconColor ?? theme.palette.primary.dark} fontSize="large" />
    </div>
  );
}
