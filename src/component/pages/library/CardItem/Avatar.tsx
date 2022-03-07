/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import Image from "next/image";
import theme from "@/styles/theme";
import { LibraryCardItemInterface } from "@/interfaces/index";
import { AllIconProps, PropsLibrarySelector } from "@/types/*";
import { getAudioPath, getPrivatePath, getPublicPath, getTalkPath } from "@/utils/directory";
import { Box } from "@material-ui/core";
import FileIcon from "@/components/ui/FileIcon";
import IconButton from "@/components/ui/IconButton";
import { isAudioFile } from "@/utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAudioPlaying } from "@/store/actions/library";
import Clickable from "@/components/ui/Clickable";

interface LibraryCardItemAvatarInterface extends LibraryCardItemInterface {
  handleClick: () => void;
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
}: LibraryCardItemAvatarInterface) => {
  const library = useSelector((state: { library: PropsLibrarySelector }) => state.library);
  const dispatch = useDispatch();
  const playPauseAudioHandle = (flag: boolean) => {
    dispatch(setCurrentAudioPlaying(!flag ? filename : ""));
  };

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

  if (type === "file" && isAudioFile(mime)) {
    return (
      <IconButton
        key={`${basename}-playpause`}
        icon={
          library.currentAudioPlaying && library.currentAudioPlaying === filename ? "stop" : "play"
        }
        iconColor={theme.palette.primary.main}
        iconStyle={{ fontSize: 45 }}
        fontSizeIcon="small"
        handleClick={() =>
          playPauseAudioHandle(
            library.currentAudioPlaying ? library.currentAudioPlaying === filename : false,
          )
        }
      />
    );
  }

  return (
    <Clickable handleClick={handleClick} data-testid={`avatar-library-item-${basename}`}>
      {image !== undefined ? (
        <Image alt={`image-${basename}-${id}`} width={60} height={60} src={image} />
      ) : (
        <Box width={60} px={1}>
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
    </Clickable>
  );
};

export default CardItemAvatar;
