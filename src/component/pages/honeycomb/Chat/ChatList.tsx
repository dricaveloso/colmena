/* eslint-disable indent */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState, useCallback } from "react";
import { ChatMessageItemInterface, ChatMessageItemInterfaceCustom } from "@/interfaces/talk";
import { MemoizedChatListItem } from "./ChatListItem";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core";
import {
  getMessagesByTokenAndBetweenIDs,
  getMessageByRefIDAndToken,
  getMessageByIDAndToken,
  getAllMessages,
} from "@/store/idb/models/chat";
import { useSelector } from "react-redux";
import { PropsHoneycombSelector, PropsUserSelector } from "@/types/*";
import { reloadChatLocalMessages } from "@/store/actions/honeycomb";

const useStyles = makeStyles(() => ({
  list: {
    textAlign: "left",
    alignItems: "stretch",
  },
  verticalList: {
    padding: 1,
  },
}));

type Props = {
  blockBeginID: number | string;
  blockEndID: number | string;
  token: string;
  conversationName: string;
  canDeleteConversation: number;
  idxElem: number;
};

// eslint-disable-next-line max-len
export function ChatList({
  blockBeginID,
  blockEndID,
  token,
  idxElem,
  conversationName,
  canDeleteConversation,
}: Props) {
  const classes = useStyles();
  const footerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const honeycombRdx = useSelector(
    (state: { honeycomb: PropsHoneycombSelector }) => state.honeycomb,
  );
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const { chatMessagesBlockLoad } = honeycombRdx;
  const renderFooter =
    chatMessagesBlockLoad.filter((item) => item.token === token).length - 1 === idxElem;

  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);

  const scrollDownAutomatically = useCallback(() => {
    footerRef?.current?.scrollIntoView();
  }, []);

  const init = async () => {
    let data = [];
    if (blockBeginID !== blockEndID)
      data = await getMessagesByTokenAndBetweenIDs(token, blockBeginID, blockEndID);
    else {
      let res;
      if (typeof blockBeginID === "string")
        res = await getMessageByRefIDAndToken(token, blockBeginID);
      else if (typeof blockBeginID === "number")
        res = await getMessageByIDAndToken(token, blockBeginID);

      data = [res];
    }

    const allData = await getAllMessages(token);
    // if (idxElem !== 0 && blockBeginID !== blockEndID) {
    //   const firstElement = data.shift();
    // }
    setData(data);
    setAllData(allData);

    if (renderFooter) {
      setTimeout(() => {
        scrollDownAutomatically();
      }, 500);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <List ref={listRef} className={classes.list}>
      {data.length > 0 &&
        data.map((item: ChatMessageItemInterface, idx: number) => (
          // eslint-disable-next-line react/no-array-index-key
          <ListItem key={idx} disableGutters className={classes.verticalList}>
            <MemoizedChatListItem
              // prevItem={allData[allData.findIndex(
              //   (item2: ChatMessageItemInterfaceCustom) =>
              //     item2.id === item.id || item2.referenceId === item.referenceId,
              // ) - 1] || null}
              prevItem={null}
              canDeleteConversation={canDeleteConversation}
              item={item}
              userId={userRdx.user.id}
            />
          </ListItem>
        ))}
      {renderFooter && (
        <ListItem key={`footer${blockBeginID}${blockEndID}`} disableGutters>
          <div ref={footerRef} style={{ width: "100%", height: 80 }}></div>
        </ListItem>
      )}
    </List>
  );
}

export const MemoizedChatList = React.memo(ChatList);
