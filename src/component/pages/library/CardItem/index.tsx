/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo, useCallback } from "react";
import { LibraryCardItemInterface } from "@/interfaces/index";
import IconButton from "@/components/ui/IconButton";
import Box from "@material-ui/core/Box";
import VerticalItemList from "@/components/ui/VerticalItemList";
import GridItemList from "@/components/ui/GridItemList";
import { PropsLibrarySelector } from "@/types/index";
import { isAudioFile } from "@/utils/utils";
import { setCurrentAudioPlaying } from "@/store/actions/library";
import { useDispatch, useSelector } from "react-redux";
import CardItemSubtitle from "./Subtitle";
import CardItemAvatar from "./Avatar";
import CardItemStatus from "./ItemStatus";
import CardItemTitle from "./Title";

const CardItem = (cardItem: LibraryCardItemInterface) => {
  const {
    id,
    basename,
    filename,
    environment,
    type,
    orientation,
    mime,
    size,
    options,
    bottomOptions,
    handleOpenCard,
    isDisabled,
    arrayBufferBlob,
  } = cardItem;
  const library = useSelector((state: { library: PropsLibrarySelector }) => state.library);
  const handleClick = useCallback(() => {
    if (!isDisabled) {
      handleOpenCard(cardItem);
    }
  }, [cardItem, handleOpenCard, isDisabled]);

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

  const subtitleVerticalItem = useMemo(
    () => (
      <Box display="flex" alignItems="center">
        <CardItemSubtitle key={`title-${id}`} {...cardItem} />
        {badgeStatusGrid}
      </Box>
    ),
    [cardItem],
  );

  return (
    <>
      {orientation === "vertical" ? (
        <VerticalItemList
          key={`${basename}-card`}
          avatar={<CardItemAvatar {...cardItem} handleClick={handleClick} />}
          primary={<CardItemTitle title={basename} handleClick={handleClick} />}
          secondary={subtitleVerticalItem}
          options={options && options(cardItem)}
          handleClick={handleClick}
          isPlaying={library.currentAudioPlaying ? library.currentAudioPlaying === filename : false}
          environment={environment}
          filename={filename}
          size={size}
          arrayBufferBlob={arrayBufferBlob}
        />
      ) : (
        <GridItemList
          key={`${basename}-card`}
          avatar={<CardItemAvatar {...cardItem} handleClick={handleClick} />}
          primaryFormatted={formatPrimaryWithSecondaryGrid}
          primary={basename}
          topOptions={options && options(cardItem)}
          bottomOptions={bottomOptions && bottomOptions(cardItem, badgeStatusGrid)}
          handleClick={handleClick}
          isPlaying={library.currentAudioPlaying ? library.currentAudioPlaying === filename : false}
          environment={environment}
          filename={filename}
          size={size}
        />
      )}
    </>
  );
};

export default CardItem;
