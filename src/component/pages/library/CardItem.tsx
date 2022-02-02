/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  getTalkPath,
} from "@/utils/directory";
import FileIcon from "@/components/ui/FileIcon";
import { AllIconProps, PropsLibrarySelector } from "@/types/index";
import { BadgeVariantEnum, EnvironmentEnum, TextColorEnum, TextVariantEnum } from "@/enums/*";
import Badge from "@/components/ui/Badge";
import { isAudioFile } from "@/utils/utils";
import { setCurrentAudioPlaying } from "@/store/actions/library";
import { useDispatch, useSelector } from "react-redux";
import Text from "@/components/ui/Text";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import theme from "@/styles/theme";

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
  const library = useSelector((state: { library: PropsLibrarySelector }) => state.library);
  const [isPlaying, setIsPlaying] = useState(library.currentAudioPlaying === filename);
  const [isPause, setIsPaused] = useState(true);
  const dispatch = useDispatch();
  const handleClick = useCallback(() => {
    if (!isDisabled) {
      handleOpenCard(cardItem);
    }
  }, [cardItem, handleOpenCard, isDisabled]);

  const playPauseAudioHandle = (flag: boolean) => {
    dispatch(setCurrentAudioPlaying(!flag ? filename : ""));
  };

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
          icon={isPlaying ? "stop" : "play"}
          iconColor={theme.palette.primary.main}
          iconStyle={{ fontSize: 45 }}
          fontSizeIcon="small"
          handleClick={() => playPauseAudioHandle(isPlaying)}
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
        <span key={`tag-${basename}-${id}`} style={{ display: "inline-block", marginLeft: "5px" }}>
          <Badge description="offline" variant={BadgeVariantEnum.ERROR} />
        </span>,
      );
    } else if (environment === EnvironmentEnum.BOTH) {
      secondaryText.push(
        <span key={`tag-${basename}-${id}`} style={{ display: "inline-block", marginLeft: "5px" }}>
          <Badge description="sync" variant={BadgeVariantEnum.SUCCESS} />
        </span>,
      );
    }

    return secondaryText;
  }, [basename, createdAtDescription, environment, id]);

  const badgeStatusGrid = useMemo(() => {
    if (environment === EnvironmentEnum.LOCAL) {
      return (
        <span
          key={`tag-grid-${basename}-${id}`}
          style={{ display: "inline-block", marginLeft: "5px" }}
        >
          <Badge description="offline" variant={BadgeVariantEnum.ERROR} />
        </span>
      );
    }
    if (environment === EnvironmentEnum.BOTH) {
      return (
        <span
          key={`tag-grid-${basename}-${id}`}
          style={{ display: "inline-block", marginLeft: "5px" }}
        >
          <Badge description="sync" variant={BadgeVariantEnum.SUCCESS} />
        </span>
      );
    }
    return "";
  }, [basename, environment, id]);

  const matchXs = useMediaQuery(theme.breakpoints.down("sm"));

  const formatPrimaryWithSecondaryGrid = (
    <Box
      display="flex"
      paddingBottom={3}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Text
        variant={TextVariantEnum.BODY1}
        noWrap
        style={{ width: matchXs ? 150 : 250, textAlign: "center" }}
      >
        {basename}
      </Text>
      <Text variant={TextVariantEnum.CAPTION} style={{ color: "#757575" }}>
        {createdAtDescription}
      </Text>
    </Box>
  );

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
          isPlaying={isPlaying}
          environment={environment}
          filename={filename}
          size={size}
        />
      ) : (
        <GridItemList
          key={`${basename}-card`}
          avatar={avatar}
          primaryFormatted={formatPrimaryWithSecondaryGrid}
          primary={basename}
          topOptions={options && options(cardItem)}
          bottomOptions={bottomOptions && bottomOptions(cardItem, badgeStatusGrid)}
          handleClick={handleClick}
          isPlaying={isPlaying}
          environment={environment}
          filename={filename}
          size={size}
        />
      )}
    </>
  );
};

export default CardItem;
