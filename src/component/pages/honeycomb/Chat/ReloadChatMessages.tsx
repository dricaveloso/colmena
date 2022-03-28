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

export async function prepareOnlineData(token: string, onlineMessages: ChatMessageItemInterface[]) {
  let localMessages = await getAllMessages(token);
  localMessages = localMessages
    .filter((item: ChatMessageItemInterfaceCustom) => item.nextcloudId)
    .sort((a: any, b: any) => a.nextcloudId - b.nextcloudId)
    .reverse();

  let lastIdInsertedLocalMessages: number | string;
  if (localMessages.length === 0) {
    await deleteAllMessagesByToken(token);
    await addAllMessages(onlineMessages);
    let lclMessages = await getAllMessages(token);
    lclMessages = lclMessages.sort((a: any, b: any) => a.nextcloudId - b.nextcloudId).reverse();
    lastIdInsertedLocalMessages = lclMessages[0].id;
  } else {
    lastIdInsertedLocalMessages = localMessages[0].id;
  }

  const resultDifference = onlineMessages.filter((item) => item.id > lastIdInsertedLocalMessages);

  if (resultDifference.length > 0) {
    const refIdArray = localMessages
      .filter((item: ChatMessageItemInterfaceCustom) => item.referenceId)
      .map((item: ChatMessageItemInterfaceCustom) => item.referenceId);
    const messages = resultDifference.filter(
      (item: ChatMessageItemInterface) => !refIdArray.includes(item.referenceId),
    );

    console.log(messages);

    await addAllMessages(messages);
    return messages;
  }

  return [];
}

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
        const messages = await prepareOnlineData(token, onlineMessages);
        if (messages.length > 0) {
          document.dispatchEvent(
            new CustomEvent("new-messages", {
              detail: { messages },
            }),
          );
        }
      }
    },
    uuid,
  });

  if (!data && !error) return null;

  return null;
}
