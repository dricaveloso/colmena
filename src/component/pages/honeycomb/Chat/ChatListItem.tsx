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
import { AvatarMemoized } from "@/components/pages/profile/Avatar";
import AvatarCore from "@material-ui/core/Avatar";
import {
  getFirstLettersOfTwoFirstNames,
  getFormattedDistanceDateFromNow,
  isAudioFile,
} from "@/utils/utils";
import theme from "@/styles/theme";
import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import { TextVariantEnum, TextColorEnum } from "@/enums/*";
import { parseCookies, setCookie } from "nookies";
import { MemoizedAudio } from "@/components/pages/honeycomb/Chat/Files/Audio";
import Default from "./Files/Default";
import { currentDirection } from "@/utils/i18n";

import classNames from "classnames";

const useStyles = makeStyles((theme) => ({
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
  message: {
    overflowWrap: "anywhere",
    "& a": {
      color: theme.palette.primary.main,
    },
  },
}));

type Props = {
  item: ChatMessageItemInterface | undefined;
  prevItem: ChatMessageItemInterface | null | undefined;
  canDeleteConversation: number;
  userId: string;
};

export const ChatListItem = ({ item, prevItem, canDeleteConversation, userId }: Props) => {
  const cookies = parseCookies();
  const lang = cookies.NEXT_LOCALE || "en";
  const classes = useStyles();

  if (!item) return null;

  const {
    message,
    timestamp,
    actorDisplayName,
    actorId,
    systemMessage,
    id,
    messageParameters,
    referenceId,
  } = item;

  function getAvatarComponent(
    actorDisplayName: string,
    actorId: string,
    justifyContent = "flex-start",
  ) {
    if (
      (prevItem && prevItem.actorId !== actorId && systemMessage === "") ||
      prevItem?.systemMessage !== ""
    )
      return (
        <ListItemAvatar key={id} style={{ width: 30, height: 30, display: "flex", justifyContent }}>
          <AvatarMemoized size={6} userName={actorDisplayName} userId={actorId} />
        </ListItemAvatar>
      );

    return (
      <ListItemAvatar key={id} style={{ width: 30, height: 30, display: "flex", justifyContent }}>
        <span></span>
      </ListItemAvatar>
    );
  }

  const handleMessage = (message: string) => {
    const handledMessage = message.replace(
      /((?:http:|https:)\/\/\S+\.\S[^.\s,]+)/gi,
      "<a href='$1' target='_blank'>$1</a>",
    );

    if (message === handledMessage) return message;

    return (
      <Box
        component="span"
        className={classes.message}
        dangerouslySetInnerHTML={{
          __html: handledMessage,
        }}
      />
    );
  };

  const prepareCommentWithFile = (
    message: string,
    messageParameters: ChatMessageItemMessageParameterInterface | undefined,
  ): string | React.ReactNode => {
    if (message !== "{file}") return handleMessage(message);

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

  if (systemMessage === "") {
    return (
      <div className="w-full " dir={currentDirection()}>
        <Box className="flex w-full" key={id}>
          {userId === actorId && getAvatarComponent(actorDisplayName, actorId, "flex-start")}
          <Box
            className={classNames("bg-gray-100 flex w-full p-2 rounded-b-xl", {
              "rounded-ts-xl": userId !== actorId,
              "rounded-te-xl": userId === actorId,
            })}
          >
            <ListItemText
              data-testid="title"
              className={classes.description}
              primary={
                <Box
                  display="flex"
                  flex={1}
                  flexDirection={userId === actorId ? "row" : "row-reverse"}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text variant={TextVariantEnum.BODY2} style={{ fontWeight: "bold" }}>
                    {actorDisplayName}
                  </Text>
                  <Text variant={TextVariantEnum.CAPTION} style={{ color: "#9A9A9A" }}>
                    {getFormattedDistanceDateFromNow(timestamp, lang)}
                  </Text>
                </Box>
              }
              secondary={
                <div className="flex flex-start">
                  {" "}
                  {prepareCommentWithFile(message, messageParameters)}{" "}
                </div>
              }
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
          {userId !== actorId && getAvatarComponent(actorDisplayName, actorId, "flex-end")}
        </Box>
      </div>
    );
  }

  function prepareInfoMessage(
    message: string,
    messageParameters: ChatMessageItemMessageParameterInterface | undefined,
  ) {
    const arr = message.split(" ");
    const messageArr: React.ReactNode[] = [];
    arr.forEach((item, idx) => {
      if (item === "{user}" || item === "{actor}")
        messageArr.push(
          <div
            className="border px-2 py-1 flex items-baseline space-s-1 rounded-full"
            key={`chip${id}-${actorId}-${referenceId}`}
          >
            <h1 className="bg-gray-300 rounded-full w-6 h-6 text-xs font-bold flex items-center justify-center">
              {getFirstLettersOfTwoFirstNames(
                item === "{user}" ? messageParameters?.user?.name : messageParameters?.actor.name,
              )}
            </h1>
            <h1>
              {item === "{user}" ? messageParameters?.user?.name : messageParameters?.actor.name}
            </h1>
          </div>,
        );
      else messageArr.push(<span key={`span${id}${idx}`}>{item}</span>);
    });

    return messageArr;
  }

  return (
    <Box
      style={{ direction: currentDirection() }}
      className="flex w-full justify-between items-center mt-0 px-2"
      key={id}
    >
      <Box className="flex items-baseline space-s-2 font-normal">
        {prepareInfoMessage(message, messageParameters)}
      </Box>
      <Text variant={TextVariantEnum.CAPTION} color={TextColorEnum.TEXTSECONDARY}>
        {getFormattedDistanceDateFromNow(timestamp, lang)}
      </Text>
    </Box>
  );
};

export const MemoizedChatListItem = React.memo(ChatListItem);
