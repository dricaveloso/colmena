/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { makeStyles } from "@material-ui/core";
import { getAllMessages } from "@/store/idb/models/chat";
import { Virtuoso } from "react-virtuoso";
import ListItem from "@material-ui/core/ListItem";
import { MemoizedChatListItem } from "./ChatListItem";
import ChatListSkeleton from "@/components/ui/skeleton/ChatList";

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
}));

export function Chat({ token, conversationName, canDeleteConversation }: Props) {
  const classes = useStyles();
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [data, setData] = useState([]);
  const [initialItemCount, setInitialItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const init = async () => {
    setLoading(true);
    const allData = await getAllMessages(token);
    setInitialItemCount(allData.length - 1);
    setData(allData);
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Box>
      {!loading ? (
        <Virtuoso
          style={{ height: "calc(100vh - 207px)", paddingBottom: 30 }}
          data={data}
          initialTopMostItemIndex={initialItemCount}
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
      ) : (
        <ChatListSkeleton />
      )}
    </Box>
  );
}

export const MemoizedChat = React.memo(Chat);
