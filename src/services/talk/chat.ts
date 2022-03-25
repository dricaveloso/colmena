/* eslint-disable @typescript-eslint/ban-types */
import useTalkFetch from "@/hooks/useTalkFetch";
import {
  ChatMessagesListInterface,
  ChatMessagesCreateInterface,
  ChatReadInterface,
} from "@/interfaces/talk";
import talkInstance from "@/services/talk";

const responseFormat = "?format=json";

export function receiveChatMessages(
  token: string,
  options?: {},
  uuid = "",
): ChatMessagesListInterface {
  return useTalkFetch("v1")(
    `/chat/${token}${responseFormat}&limit=200&lookIntoFuture=0&uuid=${uuid}`,
    {},
    options,
  );
}

export function sendChatMessage(
  token: string,
  message: string,
  referenceId: string,
): Promise<ChatMessagesCreateInterface> {
  return talkInstance("v1").post(`chat/${token}${responseFormat}`, {
    message,
    referenceId,
  });
}

export function markChatAsRead(token: string, lastReadMessage: number): Promise<ChatReadInterface> {
  return talkInstance("v1").post(`chat/${token}/read${responseFormat}`, {
    lastReadMessage,
  });
}

export function getHoneycombUrl(token: string, displayName: string, canDeleteConversation: string) {
  return `/honeycomb/${token}/${encodeURI(displayName)}/${Number(canDeleteConversation)}`;
}
