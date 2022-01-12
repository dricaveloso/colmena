/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import {
  ChatMessageItemInterface,
  ChatMessageItemMessageParameterInterface,
} from "@/interfaces/talk";
import { makeStyles } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import {
  getFirstLettersOfTwoFirstNames,
  getFormattedDistanceDateFromNow,
  isAudioFile,
} from "@/utils/utils";
import theme from "@/styles/theme";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import { TextVariantEnum, TextColorEnum } from "@/enums/*";
import { parseCookies, setCookie } from "nookies";
import { MemoizedAudio } from "@/components/pages/honeycomb/Chat/Files/Audio";
import Default from "./Files/Default";

const useStyles = makeStyles(() => ({
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "nowrap",
    width: "100%",
    minHeight: 40,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 5,
    backgroundColor: "#fff",
  },
  description: {
    flexDirection: "column",
    flexGrow: 1,
    alignSelf: "stretch",
    overflow: "hidden",
    marginLeft: 5,
  },
}));

type Props = {
  item: ChatMessageItemInterface | undefined;
  prevItem: ChatMessageItemInterface | null | undefined;
  canDeleteConversation: number;
};

export const ChatListItem = ({ item, prevItem, canDeleteConversation }: Props) => {
  const cookies = parseCookies();
  const lang = cookies.NEXT_LOCALE || "en";
  const classes = useStyles();

  if (!item) return null;

  const { message, timestamp, actorDisplayName, actorId, systemMessage, id, messageParameters } =
    item;

  function getAvatarComponent(actorDisplayName: string, justifyContent = "flex-start") {
    if (
      (prevItem && prevItem.actorId !== actorId && systemMessage === "") ||
      prevItem?.systemMessage !== ""
    )
      return (
        <ListItemAvatar key={id} style={{ width: 30, height: 30, display: "flex", justifyContent }}>
          <Avatar>{getFirstLettersOfTwoFirstNames(actorDisplayName)}</Avatar>
        </ListItemAvatar>
      );

    return (
      <ListItemAvatar key={id} style={{ width: 30, height: 30, display: "flex", justifyContent }}>
        <span></span>
      </ListItemAvatar>
    );
  }

  function getDistanceTimeComponent(timestamp: number) {
    return (
      <Text variant={TextVariantEnum.CAPTION} style={{ color: "#9A9A9A" }}>
        {getFormattedDistanceDateFromNow(timestamp, lang)}
      </Text>
    );
  }

  const prepareCommentWithFile = (
    message: string,
    messageParameters: ChatMessageItemMessageParameterInterface | undefined,
  ): string | React.ReactNode => {
    if (message !== "{file}") return message;

    if (messageParameters) {
      const messageFile = renderMessageFile(messageParameters);
      if (message) {
        return messageFile;
      }
    }

    return message;
  };

  const renderMessageFile = (messageParameters: ChatMessageItemMessageParameterInterface) => {
    const { file } = messageParameters;
    if (!file) return false;

    const { path, name, size } = file;
    const mimetype = file?.mimetype;
    if (mimetype && isAudioFile(mimetype)) {
      return (
        <MemoizedAudio
          key={`${path}-audio`}
          filename={path}
          name={name}
          size={size}
          canDeleteConversation={canDeleteConversation}
        />
      );
    }

    return (
      <Default
        key={`${path}-file`}
        mimetype={mimetype}
        filename={path}
        name={name}
        size={size}
        canDeleteConversation={canDeleteConversation}
      />
    );
  };

  // const verifyActorAndSystemMessage = (
  //   prevItem: ChatMessageItemInterface | null | undefined,
  //   actorId: string,
  // ) =>
  //   (prevItem && prevItem.actorId !== actorId) ||
  //   (prevItem && prevItem.actorId === actorId && prevItem.systemMessage !== "");

  if (systemMessage === "")
    return (
      <Box className={classes.card} key={id}>
        {getAvatarComponent(actorDisplayName, "flex-start")}
        <ListItemText
          data-testid="title"
          className={classes.description}
          primary={
            <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
              {/* {verifyActorAndSystemMessage(prevItem, actorId) && ( */}
              <Box marginRight={1}>{actorDisplayName}</Box>
              {/* )} */}
              {getDistanceTimeComponent(timestamp)}
            </Box>
          }
          secondary={prepareCommentWithFile(message, messageParameters)}
          style={{ paddingTop: 0, marginTop: 0 }}
          primaryTypographyProps={{
            style: {
              fontSize: 14,
              fontWeight: "bold",
              color: theme.palette.primary.main,
            },
          }}
          secondaryTypographyProps={{ style: { fontSize: 14, color: "#858585" } }}
        />
      </Box>
    );

  function prepareInfoMessage(
    message: string,
    messageParameters: ChatMessageItemMessageParameterInterface | undefined,
  ) {
    const arr = message.split(" ");
    const messageArr: React.ReactNode[] = [];
    arr.forEach((item, idx) => {
      if (item === "{user}" || item === "{actor}")
        messageArr.push(
          <Chip
            key={`chip${id}`}
            size="small"
            style={{ fontSize: 12 }}
            avatar={
              <Avatar>
                {getFirstLettersOfTwoFirstNames(
                  item === "{user}" ? messageParameters?.user?.name : messageParameters?.actor.name,
                )}
              </Avatar>
            }
            label={
              item === "{user}" ? messageParameters?.user?.name : messageParameters?.actor.name
            }
          />,
        );
      else
        messageArr.push(
          <span key={`span${id}${idx}`} style={{ marginLeft: 2, marginRight: 2, fontSize: 12 }}>
            {item}
          </span>,
        );
    });

    return messageArr;
  }

  return (
    <Box
      display="flex"
      flex="1"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      style={{ marginTop: 6, marginBottom: 6, marginLeft: 10, marginRight: 10 }}
    >
      <Text
        variant={TextVariantEnum.CAPTION}
        style={{ wordBreak: "break-work" }}
        color={TextColorEnum.TEXTSECONDARY}
      >
        {prepareInfoMessage(message, messageParameters)}
      </Text>
      <Text variant={TextVariantEnum.CAPTION} color={TextColorEnum.TEXTSECONDARY}>
        {getFormattedDistanceDateFromNow(timestamp, lang)}
      </Text>
    </Box>
  );
};

export const MemoizedChatListItem = React.memo(ChatListItem);
