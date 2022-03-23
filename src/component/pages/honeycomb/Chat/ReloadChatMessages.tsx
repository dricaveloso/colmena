/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-bind */
// import React from "react";
import { receiveChatMessages } from "@/services/talk/chat";
import { addAllMessages, deleteAllMessagesByToken, getAllMessages } from "@/store/idb/models/chat";
import { useSelector, useDispatch } from "react-redux";
import {
  ChatMessagesListInterfaceCustom,
  ChatMessageItemInterface,
  ChatMessageItemInterfaceCustom,
} from "@/interfaces/talk";
import { PropsHoneycombSelector } from "@/types/*";
import { addClearHoneycombChatMessages } from "@/store/actions/honeycomb";

type Props = {
  token: string;
  uuid?: string;
};

export default function ReloadChatMessages({ token, uuid = "" }: Props) {
  const dispatch = useDispatch();
  const honeycombRdx = useSelector(
    (state: { honeycomb: PropsHoneycombSelector }) => state.honeycomb,
  );

  const { data, error } = receiveChatMessages(token, {
    refreshInterval: 2000,
    // revalidateIfStale: false,
    // revalidateOnFocus: false,
    // revalidateOnReconnect: false,
    onError: (err: any) => {
      console.log("onError", err);
    },
    onSuccess: async (data: ChatMessagesListInterfaceCustom) => {
      const onlineMessages = data.ocs.data.reverse();

      if (!honeycombRdx.clearChatMessages.includes(token)) {
        await deleteAllMessagesByToken(token);
        dispatch(addClearHoneycombChatMessages(token));
      }

      if (Array.isArray(onlineMessages) && onlineMessages.length > 0) {
        let localMessages = await getAllMessages(token);

        if (localMessages.length === 0) {
          await addAllMessages(onlineMessages);
          document.dispatchEvent(
            new CustomEvent("new-messages", {
              detail: { messages: onlineMessages },
            }),
          );
        } else {
          localMessages = localMessages.sort((a: any, b: any) => a.nextcloudId - b.nextcloudId);

          const lastIdInsertedLocalMessages = localMessages
            .filter((item: ChatMessageItemInterfaceCustom) => item.nextcloudId)
            .reverse()[0].nextcloudId;

          const resultDifference = onlineMessages.filter(
            (item) => item.id > lastIdInsertedLocalMessages,
          );

          if (resultDifference.length > 0) {
            const refIdArray = localMessages
              .filter((item: ChatMessageItemInterfaceCustom) => item.referenceId)
              .map((item: ChatMessageItemInterfaceCustom) => item.referenceId);

            const messages = resultDifference.filter(
              (item: ChatMessageItemInterface) => !refIdArray.includes(item.referenceId),
            );
            await addAllMessages(messages);
            document.dispatchEvent(
              new CustomEvent("new-messages", {
                detail: { messages },
              }),
            );
          }
        }
      }
    },
    uuid,
  });

  if (!data && !error) return null;

  return null;
}
