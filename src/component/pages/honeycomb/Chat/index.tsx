import React from "react";
import Box from "@material-ui/core/Box";
import { receiveChatMessages } from "@/services/talk/chat";
import ChatListSkeleton from "@/components/ui/skeleton/ChatList";
import MessagesList from "./ItemList";
import { useDispatch } from "react-redux";
import { setChatList } from "@/store/actions/honeycomb";
import AlertInfoCenter from "@/components/ui/AlertInfoCenter";

type Props = {
  token: string;
};

function ItemList({ token }: Props) {
  const dispatch = useDispatch();
  const { data, error } = receiveChatMessages(token);

  if (!data) {
    return (
      <WrappedList>
        <ChatListSkeleton />
      </WrappedList>
    );
  }

  if (error) {
    return (
      <WrappedList>
        <AlertInfoCenter />
      </WrappedList>
    );
  }

  dispatch(setChatList(data.ocs.data));

  return (
    <WrappedList>
      <MessagesList />
    </WrappedList>
  );
}

type WrappedProps = {
  children: React.ReactNode;
};

function WrappedList({ children }: WrappedProps) {
  return <Box>{children}</Box>;
}

export default ItemList;