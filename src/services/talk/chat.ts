/* eslint-disable @typescript-eslint/ban-types */
import useTalkFetch from "@/hooks/useTalkFetch";
import { ChatMessagesListInterface, ChatMessagesCreateInterface } from "@/interfaces/talk";
import talkInstance from "@/services/talk";

const responseFormat = "?format=json";

export function receiveChatMessages(token: string, options?: {}): ChatMessagesListInterface {
  return useTalkFetch("v1")(`/chat/${token}${responseFormat}&lookIntoFuture=1`, {}, options);
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
