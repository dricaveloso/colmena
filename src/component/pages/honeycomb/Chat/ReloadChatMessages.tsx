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
import { ChatMessagesListInterfaceCustom, ChatMessageItemInterface } from "@/interfaces/talk";

type Props = {
  token: string;
  uuid: string;
};

export default function ReloadChatMessages({ token, uuid }: Props) {
  const dispatch = useDispatch();

  const createBlockChatControl = (onlineMessages: ChatMessageItemInterface[], token: string) => {
    const blockBeginID = onlineMessages[0].id || 1;
    const blockEndID = onlineMessages[onlineMessages.length - 1].id || 1;
    dispatch(addBlockIDChatControl({ blockBeginID, blockEndID, token }));
  };

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
        const localMessages = await getAllMessages(token);
        if (localMessages.length === 0) {
          dispatch(removeBlockIDChatControlByToken(token));
          createBlockChatControl(onlineMessages, token);

          await addAllMessages(onlineMessages);
        } else {
          const limitNextcloudApiChat = 200;

          if (onlineMessages.length === limitNextcloudApiChat) {
            const lastIdInsertedLocalMessages = localMessages[localMessages.length - 1].id;
            const resultDifference = onlineMessages.filter(
              (item) => item.id > lastIdInsertedLocalMessages,
            );
            if (resultDifference.length > 0 && resultDifference.length < limitNextcloudApiChat) {
              await addAllMessages(resultDifference);
              createBlockChatControl(resultDifference, token);
            } else if (
              resultDifference.length > 0 &&
              resultDifference.length >= limitNextcloudApiChat
            ) {
              // Será necessário tratar a atualização das mensagens do usuário
              // quando houver mais de 200 mensagens não lidas
              await addAllMessages(resultDifference);
              createBlockChatControl(resultDifference, token);
            }
          } else {
            const difference = onlineMessages.length - localMessages.length;

            if (difference > 0) {
              const arrDiffMessages = onlineMessages.slice(-difference);
              await addAllMessages(arrDiffMessages);
              createBlockChatControl(arrDiffMessages, token);
            }
          }
        }
      }
    },
    uuid,
  });

  if (!data && !error) return <ChatListSkeleton />;

  return null;
}
