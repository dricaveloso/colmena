/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-bind */
import React from "react";
import { receiveChatMessages } from "@/services/talk/chat";
import { addAllMessages, getAllMessages } from "@/store/idb/models/chat";
import ChatListSkeleton from "@/components/ui/skeleton/ChatList";
import { useDispatch } from "react-redux";
import {
  addBlockIDChatControl,
  removeBlockIDChatControlByToken,
} from "@/store/actions/honeycomb/index";
import { ChatMessagesListInterfaceCustom } from "@/interfaces/talk";

type Props = {
  token: string;
  uuid: string;
};

export default function ReloadChatMessages({ token, uuid }: Props) {
  const dispatch = useDispatch();

  const { data, error } = receiveChatMessages(token, {
    // refreshInterval: 2000,
    // revalidateIfStale: false,
    // revalidateOnFocus: false,
    // revalidateOnReconnect: false,
    onError: (err: any) => {
      console.log("onError", err);
    },
    onSuccess: async (data: ChatMessagesListInterfaceCustom) => {
      const onlineMessages = data.ocs.data.reverse();

      if (Array.isArray(onlineMessages) && onlineMessages.length > 0) {
        const syncMessages = await getAllMessages(token);
        if (syncMessages.length === 0) {
          const blockBeginID = onlineMessages[0].id || 1;
          const blockEndID = onlineMessages[onlineMessages.length - 1].id || 1;
          dispatch(removeBlockIDChatControlByToken(token));
          dispatch(addBlockIDChatControl({ blockBeginID, blockEndID, token }));
          await addAllMessages(onlineMessages);
        } else if (onlineMessages.length > syncMessages.length) {
          const difference = onlineMessages.length - syncMessages.length;

          const arrDiffMessages = onlineMessages.slice(-difference);
          console.log(arrDiffMessages);
          await addAllMessages(arrDiffMessages);

          const blockBeginID = arrDiffMessages[0].id || 1;
          const blockEndIDOnline = arrDiffMessages[arrDiffMessages.length - 1].id || 1;

          dispatch(
            addBlockIDChatControl({
              blockBeginID,
              blockEndID: blockEndIDOnline,
              token,
            }),
          );
        } else if (onlineMessages.length < syncMessages.length) {
          console.log("mensagens offline a ser enviadas para o NC");
        }
      }
    },
    uuid,
  });

  if (!data && !error) return <ChatListSkeleton />;

  return null;
}
