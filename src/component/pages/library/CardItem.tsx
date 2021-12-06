/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useMemo, useCallback } from "react";
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
import { BadgeVariantEnum, EnvironmentEnum } from "@/enums/*";
import Badge from "@/components/ui/Badge";

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

  const handleClick = useCallback(() => {
    if (!isDisabled) {
      handleOpenCard(cardItem);
    }
  }, [cardItem, handleOpenCard, isDisabled]);

  const avatar = useMemo(() => {
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
  }, [basename, environment, extension, filename, handleClick, id, image, mime, type]);

  const subtitle = useMemo(() => {
    const secondaryText: Array<any> = [createdAtDescription];
    if (environment === EnvironmentEnum.LOCAL) {
      secondaryText.push(
        <div style={{ display: "inline-block", marginLeft: "5px" }}>
          <Badge description="offline" variant={BadgeVariantEnum.ERROR} />
        </div>,
      );
    } else if (environment === EnvironmentEnum.BOTH) {
      secondaryText.push(
        <div style={{ display: "inline-block", marginLeft: "5px" }}>
          <Badge description="sync" variant={BadgeVariantEnum.SUCCESS} />
        </div>,
      );
    }

    return secondaryText;
  }, [createdAtDescription, environment]);

  return (
    <>
      {orientation === "vertical" ? (
        <VerticalItemList
          key={`${basename}-card`}
          avatar={avatar}
          primary={basename}
          secondary={subtitle}
          options={options && options(cardItem)}
          handleClick={handleClick}
        />
      ) : (
        <GridItemList
          key={`${basename}-card`}
          avatar={avatar}
          primary={basename}
          secondary={subtitle}
          topOptions={options && options(cardItem)}
          bottomOptions={bottomOptions && bottomOptions(cardItem)}
          handleClick={handleClick}
        />
      )}
    </>
  );
};

export default CardItem;
