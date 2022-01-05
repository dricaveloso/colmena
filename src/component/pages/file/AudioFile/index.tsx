import React, { useEffect, useState } from "react";
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import { listFile } from "@/services/webdav/files";
import { arrayBufferToBlob } from "blob-util";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import Section from "@/components/pages/file/Section";
import { useTranslation } from "next-i18next";
import ContextMenuFile from "@/components/pages/file/ContextMenu";
import AudioWave from "@/components/pages/file/AudioWave";
import { findByFilename } from "@/store/idb/models/files";
import {
  createFile as createQuickBlob,
  findByBasename as findQuickBlobByBasename,
} from "@/store/idb/models/filesQuickBlob";
import { removeSpecialCharacters } from "@/utils/utils";
import { toast } from "@/utils/notifications";
import AudioFileSkeleton from "./skeleton";

type Props = {
  filename: string;
  data: any | undefined;
};

export default function AudioFile({ filename, data }: Props) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [blob, setBlob] = useState<Blob | null>(null);
  const { t } = useTranslation("file");
  const { t: c } = useTranslation("common");

  useEffect(() => {
    (async () => {
      try {
        const localFile = await findByFilename(filename);
        const localFileQuickFile = await findQuickBlobByBasename(
          userRdx.user.id,
          removeSpecialCharacters(filename),
        );
        let blob: Blob;
        if (localFile || localFileQuickFile) {
          blob = arrayBufferToBlob(
            localFile ? localFile.arrayBufferBlob : localFileQuickFile?.arrayBufferBlob,
          );
        } else {
          const blobRes: any = await listFile(userRdx.user.id, filename);
          if (!localFileQuickFile) {
            await createQuickBlob({
              basename: removeSpecialCharacters(filename),
              userId: userRdx.user.id,
              arrayBufferBlob: blobRes,
            });
          }
          blob = arrayBufferToBlob(blobRes);
        }
        setBlob(blob);
      } catch (e) {
        console.log(e);
        setBlob(null);
        toast(c("genericErrorMessage"), "error");
      }
    })();

    return () => {
      setBlob(null);
    };
  }, []);
  return (
    <Section title={t("audioTitle")} secondaryAction={<ContextMenuFile blob={blob} data={data} />}>
      {!data ? <AudioFileSkeleton /> : <AudioWave blob={blob} data={data} playingAs={false} />}
    </Section>
  );
}

export const MemoizedAudioFile = React.memo(AudioFile);
