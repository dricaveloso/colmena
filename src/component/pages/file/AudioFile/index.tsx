import React, { useEffect, useState } from "react";
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import { listFile } from "@/services/webdav/files";
import { arrayBufferToBlob } from "blob-util";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import Section from "@/components/pages/file/Section";
import Skeleton from "@material-ui/lab/Skeleton";
import { useTranslation } from "next-i18next";
import Box from "@material-ui/core/Box";
import ContextMenuFile from "@/components/pages/file/ContextMenu";
import AudioWave from "@/components/pages/file/AudioWave";
import { findByFilename } from "@/store/idb/models/files";
import {
  createFile as createQuickBlob,
  findByBasename as findQuickBlobByBasename,
} from "@/store/idb/models/filesQuickBlob";
import { removeSpecialCharacters } from "@/utils/utils";
import { toast } from "@/utils/notifications";

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
    if (!data) {
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
    }
    return () => {
      setBlob(null);
    };
  }, []);
  return (
    <Section title={t("audioTitle")} secondaryAction={<ContextMenuFile blob={blob} data={data} />}>
      {!blob && !data ? (
        <Box display="flex" flex={1} flexDirection="row" justifyContent="space-between">
          <Skeleton variant="circle" style={{ marginRight: 10 }} width={60} height={60} />
          <Box
            display="flex"
            flex={1}
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            alignContent="flex-start"
          >
            <Skeleton variant="text" width={150} />
            <Skeleton variant="text" width={40} height={10} />
            <Skeleton variant="text" width={100} />
          </Box>
        </Box>
      ) : (
        <AudioWave blob={blob} data={data} playingAs={false} />
      )}
    </Section>
  );
}

export const MemoizedAudioFile = React.memo(AudioFile);
