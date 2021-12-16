/* eslint-disable @typescript-eslint/ban-types */
import useTalkFetch from "@/hooks/useTalkFetch";
import { ChatMessagesListInterface, ChatMessagesCreateInterface } from "@/interfaces/talk";
import { ShareCreateInterface } from "@/interfaces/share";
import talkInstance from "@/services/talk";
import shareInstance from "@/services/share";

const responseFormat = "?format=json";

export function receiveChatMessages(token: string, options?: {}): ChatMessagesListInterface {
  return useTalkFetch("v1")(`/chat/${token}${responseFormat}&lookIntoFuture=1`, {}, options);
}

export function sendChatMessage(
  token: string,
  message: string,
): Promise<ChatMessagesCreateInterface> {
  return talkInstance("v1").post(`chat/${token}${responseFormat}`, {
    message,
  });
}

export function shareFileToChat(token: string, path: string): Promise<ShareCreateInterface> {
  return shareInstance("v1").post(`shares${responseFormat}`, {
    shareType: 10,
    shareWith: token,
    path,
  });
}
