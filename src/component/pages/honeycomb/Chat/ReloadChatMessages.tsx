/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-bind */
import React from "react";
import { receiveChatMessages } from "@/services/talk/chat";
import { addAllMessages, deleteAllMessages, getAllMessages } from "@/store/idb/models/chat";
import ChatListSkeleton from "@/components/ui/skeleton/ChatList";
import { useDispatch, useSelector } from "react-redux";
import {
  addBlockIDChatControl,
  removeBlockIDChatControlByToken,
  addClearHoneycombChatMessages,
} from "@/store/actions/honeycomb/index";
import {
  ChatMessagesListInterfaceCustom,
  ChatMessageItemInterface,
  ChatMessageItemInterfaceCustom,
} from "@/interfaces/talk";
import { PropsHoneycombSelector } from "@/types/*";

type Props = {
  token: string;
  uuid: string;
};

export default function ReloadChatMessages({ token, uuid }: Props) {
  const dispatch = useDispatch();
  const honeycombRdx = useSelector(
    (state: { honeycomb: PropsHoneycombSelector }) => state.honeycomb,
  );

  const createBlockChatControl = (onlineMessages: ChatMessageItemInterface[], token: string) => {
    const blockBeginID = onlineMessages[0].id || 1;
    const blockEndID = onlineMessages[onlineMessages.length - 1].id || 1;
    dispatch(addBlockIDChatControl({ blockBeginID, blockEndID, token }));
  };

  const prepareDataTranslate = async (
    onlineMessages: ChatMessageItemInterface[],
    localMessages: ChatMessageItemInterfaceCustom[],
  ) => {
    const messageOnline = onlineMessages.filter((item) => item.systemMessage !== "").reverse();
    const messageLocal = localMessages.find((item) => item.id === messageOnline[0].id);
    if (messageLocal?.message !== messageOnline[0].message) {
      await deleteAllMessages(token);

      dispatch(removeBlockIDChatControlByToken(token));
      createBlockChatControl(onlineMessages, token);
      await addAllMessages(onlineMessages);

      const localMessages = await getAllMessages(token);
      return localMessages;
    }

    return localMessages;
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

      if (!honeycombRdx.clearChatMessages.includes(token)) {
        dispatch(addClearHoneycombChatMessages(token));
        dispatch(removeBlockIDChatControlByToken(token));
        await deleteAllMessages(token);
      }

      if (Array.isArray(onlineMessages) && onlineMessages.length > 0) {
        const localMessages = await getAllMessages(token);
        if (localMessages.length === 0) {
          dispatch(removeBlockIDChatControlByToken(token));
          createBlockChatControl(onlineMessages, token);

          await addAllMessages(onlineMessages);
        } else {
          const limitNextcloudApiChat = 200;

          const lclMessages = await prepareDataTranslate(onlineMessages, localMessages);

          if (onlineMessages.length === limitNextcloudApiChat) {
            const lastIdInsertedLocalMessages = lclMessages[lclMessages.length - 1].id;
            const resultDifference = onlineMessages.filter(
              (item) => item.id > lastIdInsertedLocalMessages,
            );
            if (resultDifference.length > 0 && resultDifference.length < limitNextcloudApiChat) {
              console.log("men", resultDifference);
              await addAllMessages(resultDifference);
              createBlockChatControl(resultDifference, token);
            } else if (
              resultDifference.length > 0 &&
              resultDifference.length >= limitNextcloudApiChat
            ) {
              // Ser?? necess??rio tratar a atualiza????o das mensagens do usu??rio
              // quando houver mais de 200 mensagens n??o lidas
              await addAllMessages(resultDifference);
              createBlockChatControl(resultDifference, token);
            }
          } else {
            const difference = onlineMessages.length - lclMessages.length;

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
