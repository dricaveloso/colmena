/* eslint-disable @typescript-eslint/ban-types */
import { ShareCreateInterface } from "@/interfaces/share";
import shareInstance from "@/services/share";

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
