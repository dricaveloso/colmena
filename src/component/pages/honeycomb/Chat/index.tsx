/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback, useRef } from "react";
// import Box from "@material-ui/core/Box";
import { MemoizedChatList } from "./ChatList";
import { useSelector } from "react-redux";
import { PropsHoneycombSelector } from "@/types/*";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

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
}));

export function Chat({ token, conversationName, canDeleteConversation }: Props) {
  const classes = useStyles();
  const footerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const honeycombRdx = useSelector(
    (state: { honeycomb: PropsHoneycombSelector }) => state.honeycomb,
  );
  const { chatMessagesBlockLoad } = honeycombRdx;

  const renderFooter = chatMessagesBlockLoad.filter((item) => item.token === token).length - 1;

  const scrollDownAutomatically = useCallback(() => {
    footerRef?.current?.scrollIntoView();
  }, []);

  useEffect(() => {
    if (renderFooter) {
      setTimeout(() => {
        scrollDownAutomatically();
      }, 500);
    }
  }, []);

  return (
    <List ref={listRef} className={classes.list}>
      {Array.isArray(chatMessagesBlockLoad) &&
        chatMessagesBlockLoad
          .filter((item) => item.token === token)
          .map((item, idx) => (
            <MemoizedChatList
              {...item}
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              canDeleteConversation={canDeleteConversation}
              conversationName={conversationName}
              idxElem={idx}
            />
          ))}
      {renderFooter && (
        <ListItem key="footer-chat" disableGutters>
          <div ref={footerRef} style={{ width: "100%", height: 80 }}></div>
        </ListItem>
      )}
    </List>
  );
}

export const MemoizedChat = React.memo(Chat);
