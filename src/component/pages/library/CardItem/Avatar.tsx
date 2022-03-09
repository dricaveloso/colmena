/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import Image from "next/image";
import theme from "@/styles/theme";
import { LibraryCardItemInterface } from "@/interfaces/index";
import { AllIconProps, PropsLibrarySelector } from "@/types/*";
import { getAudioPath, getPrivatePath, getPublicPath, getTalkPath } from "@/utils/directory";
import { Box } from "@material-ui/core";
import FileIcon from "@/components/ui/FileIcon";
import IconButton from "@/components/ui/IconButton";
import { isAudioFile } from "@/utils/utils";
import { useSelector } from "react-redux";

interface LibraryCardItemAvatarInterface extends LibraryCardItemInterface {
  handleClick: () => void;
  handlePlayPause: (audioState: string) => void;
  audioFinishStop: boolean;
}

const CardItemAvatar = ({
  basename,
  environment,
  extension,
  filename,
  handleClick,
  id,
  image,
  mime,
  type,
  handlePlayPause,
  audioFinishStop = false,
}: LibraryCardItemAvatarInterface) => {
  const [playPause, setPlayPause] = useState<"play" | "pause" | null>(null);

  let iconColor = theme.palette.variation2.main;
  let folderSecondIcon: AllIconProps | null | undefined = null;
  if (type === "directory") {
    iconColor = theme.palette.primary.main;

    switch (filename) {
      case getPublicPath():
        folderSecondIcon = "global";
        break;
      case getPrivatePath():
        folderSecondIcon = "user";
        break;
      case getAudioPath():
        folderSecondIcon = "microphone";
        break;
      case getTalkPath():
        folderSecondIcon = "share";
        break;
      default:
        if (filename && filename.indexOf("/") < 0) {
          folderSecondIcon = "panal_flat";
        }
        break;
    }
  }

  useEffect(() => {
    if (audioFinishStop) setPlayPause("pause");
  }, [audioFinishStop]);

  const handleToggleStateAudioPlaying = () => {
    if (!playPause) {
      setPlayPause("play");
      handlePlayPause("play");
      return;
    }

    const plPa = playPause === "play" ? "pause" : "play";
    setPlayPause(plPa);
    handlePlayPause(plPa);
  };

  if (type === "file" && isAudioFile(mime)) {
    return (
      <IconButton
        key={`${basename}-playpause`}
        icon={playPause === "play" ? "pause" : "play"}
        iconColor={theme.palette.primary.main}
        iconStyle={{ fontSize: 45 }}
        fontSizeIcon="small"
        handleClick={handleToggleStateAudioPlaying}
      />
    );
  }

  return (
    <>
      {image !== undefined ? (
        <Image
          alt={`image-${basename}-${id}`}
          width={60}
          height={60}
          src={image}
          onClick={() => handleClick()}
        />
      ) : (
        <Box width={60} px={1} onClick={() => handleClick()}>
          <FileIcon
            iconColor={iconColor}
            folderSecondIcon={folderSecondIcon}
            extension={extension}
            environment={environment}
            mime={mime}
            type={type === "directory" ? type : "file"}
          />
        </Box>
      )}
    </>
  );
};

export default CardItemAvatar;
