/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Box from "@material-ui/core/Box";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { makeStyles } from "@material-ui/core";
import { getAllMessagesWithLimit } from "@/store/idb/models/chat";
import { Virtuoso, VirtuosoHandle, ScrollSeekPlaceholderProps } from "react-virtuoso";
import ListItem from "@material-ui/core/ListItem";
import { MemoizedChatListItem } from "./ChatListItem";
import { ChatMessageItemInterface } from "@/interfaces/talk";
import IconButton from "@/components/ui/IconButton";
import theme from "@/styles/theme";
import { receiveChatMessagesAxios } from "@/services/talk/chat";
import Loading from "@/components/ui/Loading";

type Props = {
  token: string;
  conversationName: string;
  canDeleteConversation: number;
};

const useStyles = makeStyles(() => ({
  list: {
    textAlign: "left",
    alignItems: "stretch",
  },
  verticalList: {
    padding: 1,
  },
  buttonScrollDown: {
    bottom: 0,
    right: 0,
    position: "absolute",
    marginBottom: 50,
  },
  containerScrollSeek: {
    padding: 8,
    boxSizing: "border-box",
    overflow: "hidden",
  },
  subContainerScrollSeek: {
    background: "#f5f5f5",
    margin: 10,
  },
}));

export function Chat({ token, conversationName, canDeleteConversation }: Props) {
  const MAX_ITEMS = 50;
  const START_INDEX = 9999999999;
  const classes = useStyles();
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [data, setData] = useState<ChatMessageItemInterface[]>([]);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [atBottom, setAtBottom] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [scroll, setScroll] = useState<"auto" | "smooth">("auto");
  const showButtonTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX);

  const scrollToIndex = (
    index: number | "LAST" = "LAST",
    behavior: "auto" | "smooth" = "smooth",
  ) => {
    if (virtuosoRef && virtuosoRef.current) virtuosoRef.current.scrollToIndex({ index, behavior });
  };

  const init = async () => {
    const data = await getAllMessagesWithLimit(token);
    setData(data);
  };

  const addMessage = (messages: ChatMessageItemInterface[]) => {
    if (atBottom) {
      setData((data) => [...data, ...messages]);
    }
  };

  useEffect(() => {
    init();
    document.addEventListener(
      "new-messages",
      (e: CustomEvent<{ messages: ChatMessageItemInterface[] }>) => {
        if (!e.detail) return;

        const messages = e.detail?.messages || [];
        if (messages && Array.isArray(messages)) {
          addMessage(messages);
        }
      },
    );
    document.addEventListener(
      "new-message",
      (e: CustomEvent<{ message: ChatMessageItemInterface }>) => {
        if (!e.detail) return;
        const message = [e.detail?.message];
        addMessage(message);
      },
    );
    setTimeout(() => {
      setScroll("smooth");
    }, 3000);
    return () => {
      if (showButtonTimeoutRef.current) clearTimeout(showButtonTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (showButtonTimeoutRef.current) clearTimeout(showButtonTimeoutRef.current);
    if (!atBottom) {
      showButtonTimeoutRef.current = setTimeout(() => setShowButton(true), 500);
    } else {
      setShowButton(false);
    }
  }, [atBottom, setShowButton]);

  const prependItems = useCallback(async () => {
    if (data[0].systemMessage === "conversation_created") return false;

    setLoadingMore(true);
    const lastKnownMessageId = !data[0].nextcloudId ? data[0].id : data[0].nextcloudId;
    const nextFirstItemIndex = firstItemIndex - MAX_ITEMS;
    try {
      const response = await receiveChatMessagesAxios(token, MAX_ITEMS, Number(lastKnownMessageId));
      const result = response.data.ocs.data.reverse();
      setLoadingMore(false);
      setTimeout(() => {
        setFirstItemIndex(() => nextFirstItemIndex);
        setData((data) => [...result, ...data]);
      }, 500);
    } catch (e) {
      setLoadingMore(false);
    }
    return false;
  }, [firstItemIndex, data, setData]);

  return (
    <Box>
      <Virtuoso
        ref={virtuosoRef}
        style={{ height: "calc(100vh - 207px)" }}
        data={data}
        startReached={prependItems}
        initialTopMostItemIndex={data.length - 1}
        firstItemIndex={firstItemIndex}
        atBottomStateChange={(bottom) => {
          setAtBottom(bottom);
        }}
        components={{
          Header: () => <Box padding={1}>{loadingMore && <Loading />}</Box>,
          Footer: () => <Box padding={3}></Box>,
        }}
        followOutput={scroll}
        itemContent={(index, item) => (
          <ListItem key={index} disableGutters className={classes.verticalList}>
            <MemoizedChatListItem
              prevItem={null}
              canDeleteConversation={canDeleteConversation}
              item={item}
              userId={userRdx.user.id}
            />
          </ListItem>
        )}
      />
      {showButton && (
        <IconButton
          icon="arrow_down_circle"
          handleClick={() => scrollToIndex(data.length - 1, "auto")}
          className={classes.buttonScrollDown}
          iconColor={theme.palette.variation1.main}
          fontSizeIcon={30}
        />
      )}
    </Box>
  );
}

export const MemoizedChat = React.memo(Chat);
