/* eslint-disable @typescript-eslint/ban-types */
import { ShareCreateInterface } from "@/interfaces/share";
import shareInstance from "@/services/share";
import { findTokenChatByPath } from "@/services/talk/room";

const responseFormat = "?format=json";

export function createShare(
  shareWith: string,
  path: string,
  shareType = 10,
): Promise<ShareCreateInterface> {
  return shareInstance("v1").post(`shares${responseFormat}`, {
    shareType,
    shareWith,
    path,
  });
}

export async function shareInChat(
  path: string,
  pathToShare: string,
): Promise<ShareCreateInterface | false> {
  const token = await findTokenChatByPath(path);
  if (token === false) {
    return Promise.resolve(false);
  }

  return createShare(token, pathToShare);
}
