/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Box from "@material-ui/core/Box";
import { MemoizedChatList } from "./ChatList";
import { useSelector } from "react-redux";
import { PropsHoneycombSelector } from "@/types/*";

type Props = {
  token: string;
  conversationName: string;
  canDeleteConversation: number;
};

export function Chat({ token, conversationName, canDeleteConversation }: Props) {
  const honeycombRdx = useSelector(
    (state: { honeycomb: PropsHoneycombSelector }) => state.honeycomb,
  );
  const { chatMessagesBlockLoad } = honeycombRdx;

  return (
    <Box>
      {Array.isArray(chatMessagesBlockLoad) &&
        chatMessagesBlockLoad
          .filter((item) => item.token === token)
          .map((item, idx) => (
            <MemoizedChatList
              {...item}
              canDeleteConversation={canDeleteConversation}
              conversationName={conversationName}
              idxElem={idx}
            />
          ))}
    </Box>
  );
}

export const MemoizedChat = React.memo(Chat);
