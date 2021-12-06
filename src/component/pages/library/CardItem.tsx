/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from "react";
import { LibraryCardItemInterface } from "@/interfaces/index";
import IconButton from "@/components/ui/IconButton";
import { useRouter } from "next/router";
import Box from "@material-ui/core/Box";
import Image from "next/image";
import VerticalItemList from "@/components/ui/VerticalItemList";
import GridItemList from "@/components/ui/GridItemList";
import {
  hasExclusivePath,
  getPublicPath,
  getPrivatePath,
  getAudioPath,
  isRootPath,
} from "@/utils/directory";
import FileIcon from "@/components/ui/FileIcon";
import { AllIconProps } from "@/types/index";

const CardItem = (cardItem: LibraryCardItemInterface) => {
  const {
    id,
    basename,
    filename,
    environment,
    createdAt,
    createdAtDescription,
    tags,
    type,
    arrayBufferBlob,
    image,
    extension,
    orientation,
    mime,
    size,
    options,
    bottomOptions,
    handleOpenCard,
    isDisabled,
  } = cardItem;
  const router = useRouter();

  const handleClick = () => {
    if (!isDisabled) {
      handleOpenCard(cardItem);
    }
  };

  let folderSecondIcon: AllIconProps | null | undefined = null;
  if (type === "directory") {
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
      default:
        if (filename && filename.indexOf("/") < 0) {
          folderSecondIcon = "panal_flat";
        }
        break;
    }
  }

  const avatar = (
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

  return (
    <>
      {orientation === "vertical" ? (
        <VerticalItemList
          key={`${basename}-card`}
          avatar={avatar}
          primary={basename}
          secondary={createdAtDescription}
          options={options && options(cardItem)}
          handleClick={handleClick}
        />
      ) : (
        <GridItemList
          key={`${basename}-card`}
          avatar={avatar}
          primary={basename}
          secondary={createdAtDescription}
          topOptions={options && options(cardItem)}
          bottomOptions={bottomOptions && bottomOptions(cardItem)}
          handleClick={handleClick}
        />
      )}
    </>
  );
};

export default CardItem;
