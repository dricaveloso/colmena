/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { TransferItemInterface } from "@/interfaces/index";
import { chunkFileUpload } from "@/services/webdav/files";
// import { isPanal, convertUsernameToPrivate } from "@/utils/directory";
import { convertUsernameToPrivate } from "@/utils/directory";
// import { shareInChat } from "@/services/share/share";
import { PropsUserSelector } from "@/types/*";
import { useSelector } from "react-redux";
import { getByTempfilename as getTransferByTempfilename } from "@/store/idb/models/transfers";

type Props = {
  file: TransferItemInterface;
};

function UploadItem({ file }: Props) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const userId = userRdx.user.id;

  const load = async () => {
    const { tempFilename, filename } = file;
    const destination = convertUsernameToPrivate(filename, userId);
    const transfer = await getTransferByTempfilename(tempFilename);

    if (transfer && transfer.status !== "complete")
      await chunkFileUpload(userId, tempFilename, destination, transfer);

    // if (isPanal(filename)) {
    //   await shareInChat(realPath, finalPath);
    // }
  };

  useEffect(() => {
    console.log("Chegou aqui", file.tempFilename);
    load();
  }, []);

  return null;
}

export const UploadItemMemoized = React.memo(UploadItem);
