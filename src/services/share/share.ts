/* eslint-disable @typescript-eslint/ban-types */
import { ShareCreateInterface, ShareItemInterface, ShareResultInterface } from "@/interfaces/share";
import shareInstance from "@/services/share";
import { findTokenChatByPath } from "@/services/talk/room";
import { isPanal } from "@/utils/directory";
import { removeCornerSlash } from "@/utils/utils";

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

export async function getUserShares(): Promise<Array<ShareItemInterface>> {
  try {
    const shares: ShareResultInterface = await shareInstance("v1").get(`shares${responseFormat}`);
    if (typeof shares.data.ocs.data === "object") {
      return shares.data.ocs.data;
    }
  } catch (e) {
    console.log(e);
  }

  return [];
}

export async function isFileOwner(filename: string) {
  let canDelete = true;
  const shares = await getUserShares();
  if (isPanal(filename)) {
    const exists = shares.find((item) => {
      const sharefile = removeCornerSlash(item.file_target.replace(/^.+?\/(.*)$/, "$1"));
      const file = removeCornerSlash(filename.replace(/^.+?\/(.*)$/, "$1"));
      return sharefile === file;
    });
    canDelete = exists !== undefined;
  }

  return canDelete;
}
