/* eslint-disable @typescript-eslint/ban-types */
import { ShareCreateInterface } from "@/interfaces/share";
import shareInstance from "@/services/share";

const responseFormat = "?format=json";

export function createNewShare(
  folderName: string,
  tokenConversation: string,
): Promise<ShareCreateInterface> {
  return shareInstance("v1").post(
    `shares${responseFormat}&path=${folderName}&shareType=10&shareWith=${tokenConversation}&publicUpload=false&permissions=31`,
  );
}
