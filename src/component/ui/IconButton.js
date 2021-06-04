import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CloudIcon from "@material-ui/icons/Cloud";
import CloudQueueIcon from "@material-ui/icons/CloudQueue";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import EditIcon from "@material-ui/icons/Edit";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import ShareIcon from "@material-ui/icons/Share";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import GraphicEqIcon from "@material-ui/icons/GraphicEq";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import StopIcon from "@material-ui/icons/Stop";
import FastForwardIcon from "@material-ui/icons/FastForward";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import CropIcon from "@material-ui/icons/Crop";
import FacebookIcon from "@material-ui/icons/Facebook";
import TelegramIcon from "@material-ui/icons/Telegram";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import CloudCircleIcon from "@material-ui/icons/CloudCircle";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";
import MicIcon from "@material-ui/icons/Mic";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import WifiOffSharpIcon from "@material-ui/icons/WifiOffSharp";
import PermDataSettingSharpIcon from "@material-ui/icons/PermDataSettingSharp";
import CloudUploadSharpIcon from "@material-ui/icons/CloudUploadSharp";
import SupervisedUserCircleSharpIcon from "@material-ui/icons/SupervisedUserCircleSharp";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import SearchIcon from "@material-ui/icons/Search";

function IconButtonCtr({
  title = null,
  fontSizeIcon = "3.5em",
  variantTitle = "h5",
  color = "black",
  handleClick = null,
  icon,
  extraStyleIcon = {},
}) {
  const iconProps = {
    fontSize: fontSizeIcon,
    color,
    style: { ...extraStyleIcon },
  };

  const discoverIcon = (iconName) => {
    switch (iconName) {
      case "GroupAddIcon":
        return <GroupAddIcon style={{ ...iconProps }} />;
      case "FiberManualRecordIcon":
        return <FiberManualRecordIcon style={{ ...iconProps }} />;
      case "AddCircleOutlineIcon":
        return <AddCircleOutlineIcon style={{ ...iconProps }} />;
      case "CloudIcon":
        return <CloudIcon style={{ ...iconProps }} />;
      case "CloudQueueIcon":
        return <CloudQueueIcon style={{ ...iconProps }} />;
      case "LibraryMusicIcon":
        return <LibraryMusicIcon style={{ ...iconProps }} />;
      case "EditIcon":
        return <EditIcon style={{ ...iconProps }} />;
      case "PhotoCameraIcon":
        return <PhotoCameraIcon style={{ ...iconProps }} />;
      case "ShareIcon":
        return <ShareIcon style={{ ...iconProps }} />;
      case "PersonAddIcon":
        return <PersonAddIcon style={{ ...iconProps }} />;
      case "GraphicEqIcon":
        return <GraphicEqIcon style={{ ...iconProps }} />;
      case "PlayCircleOutlineIcon":
        return <PlayCircleOutlineIcon style={{ ...iconProps }} />;
      case "StopIcon":
        return <StopIcon style={{ ...iconProps }} />;
      case "FastForwardIcon":
        return <FastForwardIcon style={{ ...iconProps }} />;
      case "FastRewindIcon":
        return <FastRewindIcon style={{ ...iconProps }} />;
      case "CropIcon":
        return <CropIcon style={{ ...iconProps }} />;
      case "FacebookIcon":
        return <FacebookIcon style={{ ...iconProps }} />;
      case "TelegramIcon":
        return <TelegramIcon style={{ ...iconProps }} />;
      case "WhatsAppIcon":
        return <WhatsAppIcon style={{ ...iconProps }} />;
      case "CloudCircleIcon":
        return <CloudCircleIcon style={{ ...iconProps }} />;
      case "MicIcon":
        return <MicIcon style={{ ...iconProps }} />;
      case "PhoneAndroidIcon":
        return <PhoneAndroidIcon style={{ ...iconProps }} />;
      case "DesktopWindowsIcon":
        return <DesktopWindowsIcon style={{ ...iconProps }} />;
      case "WifiOffSharpIcon":
        return <WifiOffSharpIcon style={{ ...iconProps }} />;
      case "PermDataSettingSharpIcon":
        return <PermDataSettingSharpIcon style={{ ...iconProps }} />;
      case "CloudUploadSharpIcon":
        return <CloudUploadSharpIcon style={{ ...iconProps }} />;
      case "SupervisedUserCircleSharpIcon":
        return <SupervisedUserCircleSharpIcon style={{ ...iconProps }} />;
      case "SupervisedUserCircleIcon":
        return <SupervisedUserCircleIcon style={{ ...iconProps }} />;
      case "SearchIcon":
        return <SearchIcon style={{ ...iconProps }} />;
      default:
        return <GroupAddIcon style={{ ...iconProps }} />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <IconButton
        style={{ margin: 0, padding: 5, fontSize: fontSizeIcon, color }}
        onClick={handleClick}
      >
        {discoverIcon(icon)}
      </IconButton>
      {!!title && (
        <Typography
          component={variantTitle}
          variant={variantTitle}
          align="center"
          gutterBottom
        >
          {title}
        </Typography>
      )}
    </div>
  );
}

export default IconButtonCtr;
