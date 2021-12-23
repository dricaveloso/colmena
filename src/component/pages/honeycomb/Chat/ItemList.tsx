/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState, useCallback } from "react";
import { ChatMessageItemInterface } from "@/interfaces/talk";
import { MemoizedVerticalItemList } from "./VerticalItemList";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core";
import {
  getMessagesByTokenAndBetweenIDs,
  getMessageByIDAndToken,
  getAllMessages,
  getAllLocalMessages,
} from "@/store/idb/models/chat";
import { useSelector, useDispatch } from "react-redux";
import { PropsHoneycombSelector } from "@/types/*";
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
  blockBeginID: number;
  blockEndID: number;
  token: string;
  idxElem: number;
};

export function ItemList({ blockBeginID, blockEndID, token, idxElem }: Props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const footerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const honeycombRdx = useSelector(
    (state: { honeycomb: PropsHoneycombSelector }) => state.honeycomb,
  );
  const { chatMessagesBlockLoad, reloadChatLocalMessage } = honeycombRdx;
  const renderFooter = chatMessagesBlockLoad.length - 1 === idxElem;

  const [data, setData] = useState([]);
  const [localData, setLocalData] = useState([]);
  const [allData, setAllData] = useState([]);

  const scrollDownAutomatically = useCallback(() => {
    footerRef?.current?.scrollIntoView();
  }, []);

  useEffect(() => {
    (async () => {
      let data;
      if (blockBeginID !== blockEndID)
        data = await getMessagesByTokenAndBetweenIDs(token, blockBeginID, blockEndID);
      else {
        const res = await getMessageByIDAndToken(token, blockBeginID);
        data = [res];
      }

      const allData = await getAllMessages(token);
      if (idxElem !== 0 && blockBeginID !== blockEndID) {
        const firstElement = data.shift();
      }
      setData(data);
      setAllData(allData);
    })();
    if (renderFooter) {
      setTimeout(() => {
        scrollDownAutomatically();
      }, 500);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (reloadChatLocalMessage) {
        const res = await getAllLocalMessages(token);
        setLocalData(res);
        dispatch(reloadChatLocalMessages(true));
      }
    })();
  }, [reloadChatLocalMessage]);

  return (
    <List ref={listRef} className={classes.list}>
      {data.length > 0 &&
        data.map((item: ChatMessageItemInterface, idx: number) => (
          // eslint-disable-next-line react/no-array-index-key
          <ListItem key={idx} disableGutters className={classes.verticalList}>
            <MemoizedVerticalItemList
              prevItem={allData.find((item2: ChatMessageItemInterface) => item2.id === item.id - 1)}
              item={item}
            />
          </ListItem>
        ))}
      {localData.length > 0 &&
        localData.map((item: ChatMessageItemInterface, idx: number) => (
          // eslint-disable-next-line react/no-array-index-key
          <ListItem key={idx} disableGutters className={classes.verticalList}>
            <MemoizedVerticalItemList
              prevItem={localData[idx - 1] ? localData[idx - 1] : null}
              item={item}
            />
          </ListItem>
        ))}
      {renderFooter && (
        <ListItem key={`footer${blockBeginID}${blockEndID}`} disableGutters>
          <div ref={footerRef} style={{ width: "100%", height: 110 }}></div>
        </ListItem>
      )}
    </List>
  );
}

export const MemoizedItemList = React.memo(ItemList);
