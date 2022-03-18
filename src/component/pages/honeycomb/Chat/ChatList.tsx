/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState, useCallback } from "react";
import { ChatMessageItemInterface, ChatMessageItemInterfaceCustom } from "@/interfaces/talk";
import { MemoizedChatListItem } from "./ChatListItem";
import ListItem from "@material-ui/core/ListItem";
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

export function ChatList({
  blockBeginID,
  blockEndID,
  token,
  idxElem,
  conversationName,
  canDeleteConversation,
}: Props) {
  const classes = useStyles();
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);

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
    setData(data);
    setAllData(allData);
  };

  useEffect(() => {
    init();
  }, []);

  if (data.length === 0) return null;

  return (
    <>
      {data.map((item: ChatMessageItemInterface, idx: number) => (
        // eslint-disable-next-line react/no-array-index-key
        <ListItem key={idx} disableGutters className={classes.verticalList}>
          <MemoizedChatListItem
            prevItem={null}
            canDeleteConversation={canDeleteConversation}
            item={item}
            userId={userRdx.user.id}
          />
        </ListItem>
      ))}
    </>
  );
}

export const MemoizedChatList = React.memo(ChatList);
