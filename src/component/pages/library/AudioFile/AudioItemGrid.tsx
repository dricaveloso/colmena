/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Environment, PropsUserSelector } from "@/types/*";
import { EnvironmentEnum, TextVariantEnum } from "@/enums/*";
import { findByBasename } from "@/store/idb/models/files";
import {
  findByBasename as findQuickBlobByBasename,
  createFile as createQuickBlob,
} from "@/store/idb/models/filesQuickBlob";
import Text from "@/components/ui/Text";
import Box from "@material-ui/core/Box";
import { removeSpecialCharacters, fancyTimeFormat, formatBytes } from "@/utils/utils";
import { useSelector } from "react-redux";
import { createObjectURL, arrayBufferToBlob } from "blob-util";
import Waves from "@/components/pages/file/AudioWave/Waves";
import getBlobDuration from "get-blob-duration";
import { listFile } from "@/services/webdav/files";
import CircularProgress from "@material-ui/core/CircularProgress";

type Props = {
  filename: string;
  environment: Environment;
  primary: string | React.ReactNode;
  size: number;
};

export default function AudioItemGrid({ filename, environment, primary, size }: Props) {
  const [loading, setLoading] = useState(false);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState("");

  async function prepareAudioBlob(content: ArrayBuffer) {
    const blob = arrayBufferToBlob(content);
    const urlBlob = createObjectURL(blob);
    const duration = await getBlobDuration(urlBlob);
    setDuration(fancyTimeFormat(duration));
    setBlob(blob);
  }

  useEffect(() => {
    (async () => {
      try {
        if (environment === EnvironmentEnum.LOCAL || environment === EnvironmentEnum.BOTH) {
          const localFile = await findByBasename(
            userRdx.user.id,
            removeSpecialCharacters(filename),
          );
          await prepareAudioBlob(localFile?.arrayBufferBlob);
        } else if (environment === EnvironmentEnum.REMOTE) {
          const localFile = await findQuickBlobByBasename(
            userRdx.user.id,
            removeSpecialCharacters(filename),
          );
          if (!localFile) {
            setLoading(true);
            const result: any = await listFile(userRdx.user.id, filename);
            await createQuickBlob({
              basename: removeSpecialCharacters(filename),
              userId: userRdx.user.id,
              arrayBufferBlob: result,
            });
            await prepareAudioBlob(result);
          } else {
            await prepareAudioBlob(localFile?.arrayBufferBlob);
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }

      return () => {
        setBlob(null);
        setDuration("");
        setLoading(false);
      };
    })();
  }, []);

  return loading ? (
    <Box display="flex" flex={1} height={60} justifyContent="center" alignItems="center">
      <CircularProgress size={20} />
    </Box>
  ) : (
    <Box display="flex" flex={1} style={{ width: "100%" }} flexDirection="column">
      <Text variant={TextVariantEnum.BODY1} style={{ fontSize: 12.5, textAlign: "center" }}>
        {primary}
      </Text>
      <Text
        variant={TextVariantEnum.BODY2}
        style={{ fontSize: 10, textAlign: "center", color: "gray" }}
      >
        {`${duration} - ${formatBytes(size)}`}
      </Text>
      {blob && <Waves blob={blob} config={{ height: 20 }} play />}
    </Box>
  );
}
