/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { arrayBufferToBlob, createObjectURL } from "blob-util";
import Waves from "@/components/pages/file/AudioWave/Waves";
import getBlobDuration from "get-blob-duration";
import { listFile } from "@/services/webdav/files";
import CircularProgress from "@material-ui/core/CircularProgress";
import { toast } from "@/utils/notifications";
import { useTranslation } from "react-i18next";

type Props = {
  filename: string;
  environment: Environment;
  primary: string | React.ReactNode;
  size: number;
  type: "vertical" | "grid";
};

export default function AudioItemVertical({ filename, environment, primary, size, type }: Props) {
  const [loading, setLoading] = useState(false);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState("");
  const { t: c } = useTranslation("common");

  async function prepareAudioBlob(content: ArrayBuffer) {
    const blob = arrayBufferToBlob(content);
    const urlBlob = createObjectURL(blob);
    const duration = await getBlobDuration(urlBlob);
    setDuration(fancyTimeFormat(duration));
    setBlob(blob);
  }

  const init = async () => {
    try {
      if (environment === EnvironmentEnum.LOCAL || environment === EnvironmentEnum.BOTH) {
        const localFile = await findByBasename(userRdx.user.id, removeSpecialCharacters(filename));
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
      toast(c("genericErrorMessage"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();

    return () => {
      setBlob(null);
      setDuration("");
      setLoading(false);
    };
  }, []);

  if (type === "vertical")
    return loading ? (
      <Box display="flex" flex={1} height={45} justifyContent="center" alignItems="center">
        <CircularProgress size={20} />
      </Box>
    ) : (
      <Box display="flex" flex={1} flexDirection="column">
        {blob && <Waves blob={blob} config={{ height: 36 }} play />}
        <Box display="flex" flex={1} flexDirection="row" justifyContent="space-between">
          <Text variant={TextVariantEnum.BODY1} style={{ fontSize: 10 }}>
            {formatBytes(size)}
          </Text>
          <Text variant={TextVariantEnum.BODY2} style={{ fontSize: 10, color: "gray" }}>
            {duration}
          </Text>
        </Box>
      </Box>
    );

  if (type === "grid")
    return loading ? (
      <Box display="flex" flex={1} height={75} justifyContent="center">
        <CircularProgress size={20} />
      </Box>
    ) : (
      <Box display="flex" flex={1} marginBottom={2} height={50} width="100%" flexDirection="column">
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Text
            variant={TextVariantEnum.BODY2}
            style={{ fontSize: 10, textAlign: "center", color: "gray" }}
          >
            {formatBytes(size)}
          </Text>
          <Text
            variant={TextVariantEnum.BODY2}
            style={{ fontSize: 10, textAlign: "center", color: "gray" }}
          >
            {duration}
          </Text>
        </Box>
        {blob && <Waves blob={blob} config={{ height: 36 }} play />}
      </Box>
    );

  return null;
}
