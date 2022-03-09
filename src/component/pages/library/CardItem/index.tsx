/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { LibraryCardItemInterface } from "@/interfaces/index";
import Box from "@material-ui/core/Box";
import VerticalItemList from "@/components/ui/VerticalItemList";
import GridItemList from "@/components/ui/GridItemList";
import { PropsUserSelector } from "@/types/index";
import { useSelector } from "react-redux";
import CardItemSubtitle from "./Subtitle";
import CardItemAvatar from "./Avatar";
import CardItemStatus from "./ItemStatus";
import CardItemTitle from "./Title";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";
import {
  findByBasename as findQuickBlobByBasename,
  createFile as createQuickBlob,
  removeFile,
} from "@/store/idb/models/filesQuickBlob";
import { removeSpecialCharacters } from "@/utils/utils";
import { listFile } from "@/services/webdav/files";
import { useTranslation } from "react-i18next";
import { toast } from "@/utils/notifications";

const CardItem = (cardItem: LibraryCardItemInterface) => {
  const {
    id,
    basename,
    filename,
    environment,
    orientation,
    size,
    options,
    bottomOptions,
    handleOpenCard,
    isDisabled,
    arrayBufferBlob,
    subtitle,
  } = cardItem;
  const handleClick = useCallback(() => {
    if (!isDisabled && typeof handleOpenCard === "function") {
      handleOpenCard(cardItem);
    }
  }, [cardItem, handleOpenCard, isDisabled]);
  const [audioState, setAudioState] = useState<"play" | "pause" | "stop">("stop");
  const [audioFinishStop, setAudioFinishStop] = useState(false);
  const { t: c } = useTranslation("common");
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [arrayBufferIntern, setArrayBufferIntern] = useState<ArrayBuffer | null>(null);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  const badgeStatusGrid = useMemo(() => <CardItemStatus {...cardItem} />, [cardItem]);

  const formatPrimaryWithSecondaryGrid = (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <CardItemTitle
        title={basename}
        handleClick={handleClick}
        textStyle={{ maxWidth: "100%", textAlign: "center" }}
      />
      <CardItemSubtitle key={`title-${id}`} {...cardItem} />
    </Box>
  );

  const subtitleVerticalItem = useMemo(() => {
    if (subtitle) {
      return (
        <Text variant={TextVariantEnum.CAPTION} noWrap>
          {subtitle}
        </Text>
      );
    }

    return (
      <Box display="flex" alignItems="center">
        <CardItemSubtitle key={`title-${id}`} {...cardItem} />
        {badgeStatusGrid}
      </Box>
    );
  }, [cardItem]);

  const loadAudioBlob = async () => {
    const localFile = await findQuickBlobByBasename(
      userRdx.user.id,
      removeSpecialCharacters(filename),
    );
    if (localFile) {
      setArrayBufferIntern(localFile?.arrayBufferBlob);
      return;
    }

    try {
      setLoadingAudio(true);
      const result: any = await listFile(userRdx.user.id, filename);
      removeFile(userRdx.user.id, removeSpecialCharacters(filename));
      await createQuickBlob({
        basename: removeSpecialCharacters(filename),
        userId: userRdx.user.id,
        arrayBufferBlob: result,
      });
      setArrayBufferIntern(result);
    } catch (e) {
      console.log(e);
      setAudioState("stop");
    } finally {
      setLoadingAudio(false);
    }
  };

  useEffect(() => {
    if (audioState === "play" && !arrayBufferIntern) {
      setAudioFinishStop(false);
      loadAudioBlob();
    } else if (audioState === "stop") {
      setArrayBufferIntern(null);
      setAudioFinishStop(true);
    } else {
      setAudioFinishStop(false);
    }
  }, [audioState]);

  return (
    <>
      {orientation === "vertical" ? (
        <VerticalItemList
          key={`${basename}-card`}
          avatar={
            <CardItemAvatar
              {...cardItem}
              handleClick={handleClick}
              handlePlayPause={(audioState: "play" | "pause") => setAudioState(audioState)}
              audioFinishStop={audioFinishStop}
            />
          }
          primary={<CardItemTitle title={basename} handleClick={handleClick} />}
          secondary={subtitleVerticalItem}
          options={options && options(cardItem)}
          handleClick={handleClick}
          audioState={audioState}
          environment={environment}
          filename={filename}
          size={size}
          arrayBufferBlob={arrayBufferBlob || arrayBufferIntern}
          handleAudioFinish={() => setAudioState("stop")}
        />
      ) : (
        <GridItemList
          key={`${basename}-card`}
          avatar={
            <CardItemAvatar
              {...cardItem}
              handleClick={handleClick}
              handlePlayPause={(audioState: "play" | "pause") => setAudioState(audioState)}
              audioFinishStop={audioFinishStop}
            />
          }
          primaryFormatted={formatPrimaryWithSecondaryGrid}
          primary={basename}
          topOptions={options && options(cardItem)}
          bottomOptions={bottomOptions && bottomOptions(cardItem, badgeStatusGrid)}
          handleClick={handleClick}
          environment={environment}
          filename={filename}
          size={size}
          arrayBufferBlob={arrayBufferBlob || arrayBufferIntern}
          audioState={audioState}
          handleAudioFinish={() => setAudioState("stop")}
        />
      )}
    </>
  );
};

export default CardItem;
