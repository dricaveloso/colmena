import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { blobFile } from "@/services/webdav/files";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { arrayBufferToBlob } from "blob-util";
import { downloadFile } from "@/utils/utils";
import LoadingPage from "@/components/ui/LoadingPage";
import { toast } from "@/utils/notifications";

type Props = {
  open: boolean;
  handleOpen: (opt: boolean) => void;
  filename: string;
  basename: string;
  mime?: string;
  arrayBufferBlob?: ArrayBuffer | undefined;
};

export default function DownloadModal({
  open,
  handleOpen,
  filename,
  basename,
  mime,
  arrayBufferBlob,
}: Props) {
  const { t } = useTranslation("library");
  const [downloadError, setDownloadError] = useState<boolean>(false);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  useEffect(() => {
    if (open === true) {
      (async () => {
        setDownloadError(false);
        let dataBlob: Blob | null | boolean = null;
        if (arrayBufferBlob) {
          dataBlob = localUrlDownload(arrayBufferBlob);
        } else {
          dataBlob = await blobFile(userRdx.user.id, filename);
        }

        if (dataBlob instanceof Blob) {
          downloadFile(dataBlob, basename, mime);
          handleOpen(false);
        } else {
          setDownloadError(true);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filename, arrayBufferBlob]);

  useEffect(() => {
    if (downloadError) {
      toast(t("messages.cannotDownloadFile"), "error");
      handleOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadError]);

  const localUrlDownload = (arrayBufferBlob: ArrayBuffer) => arrayBufferToBlob(arrayBufferBlob);

  return <LoadingPage open={open} description={t("downloading")} />;
}
