/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Environment, PropsUserSelector } from "@/types/*";
import { EnvironmentEnum, TextVariantEnum } from "@/enums/*";
import {
  findByBasename as findQuickBlobByBasename,
  createFile as createQuickBlob,
  removeFile,
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
import { makeStyles } from "@material-ui/core/styles";

type Props = {
  filename: string;
  environment: Environment;
  primary: string | React.ReactNode;
  size: number;
  type: "vertical" | "grid";
  arrayBufferBlob?: ArrayBuffer | null;
  audioState: "play" | "pause";
  handleAudioFinish: () => void;
};

const useStyles = makeStyles(() => ({
  bytesVerticalItemTitle: {
    fontSize: 10,
  },
  durationVerticalItemTitle: {
    fontSize: 10,
    color: "gray",
  },
  bytesGridItemTitle: {
    fontSize: 10,
    textAlign: "center",
    color: "gray",
  },
  durationGridItemTitle: {
    fontSize: 10,
    textAlign: "center",
    color: "gray",
  },
}));

export async function prepareAudioBlob(content: ArrayBuffer) {
  const blob = arrayBufferToBlob(content);
  const urlBlob = createObjectURL(blob);
  const duration = await getBlobDuration(urlBlob);
  return {
    duration,
    blob,
    arrayBuffer: content,
  };
}

export default function AudioItemPreview({
  filename,
  environment,
  primary,
  size,
  type,
  arrayBufferBlob,
  audioState,
  handleAudioFinish,
}: Props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState("");
  const { t: c } = useTranslation("common");

  const init = async () => {
    try {
      if (arrayBufferBlob) {
        const res = await prepareAudioBlob(arrayBufferBlob);
        const { duration, blob } = res;
        setDuration(fancyTimeFormat(duration));
        setBlob(blob);
      } else if (environment !== EnvironmentEnum.LOCAL) {
        const localFile = await findQuickBlobByBasename(
          userRdx.user.id,
          removeSpecialCharacters(filename),
        );
        let res: { duration: number; blob: Blob };
        if (!localFile) {
          setLoading(true);
          const result: any = await listFile(userRdx.user.id, filename);
          removeFile(userRdx.user.id, removeSpecialCharacters(filename));
          await createQuickBlob({
            basename: removeSpecialCharacters(filename),
            userId: userRdx.user.id,
            arrayBufferBlob: result,
          });
          res = await prepareAudioBlob(result);
        } else {
          res = await prepareAudioBlob(localFile?.arrayBufferBlob);
        }
        const { duration, blob } = res;
        setDuration(fancyTimeFormat(duration));
        setBlob(blob);
      }
    } catch (e) {
      console.log(e);
      toast(c("unavailableAudio"), "error");
      handleAudioFinish();
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

  const renderAudioWaves = () => (
    <Waves
      blob={blob}
      config={{ height: 36 }}
      play={audioState === "play"}
      pause={audioState === "pause"}
      handleAudioFinish={handleAudioFinish}
    />
  );
  const renderCircularProgress = (
    <Box display="flex" flex={1} height={45} justifyContent="center" alignItems="center">
      <CircularProgress size={20} />
    </Box>
  );

  if (type === "vertical")
    return loading ? (
      renderCircularProgress
    ) : (
      <Box display="flex" flex={1} flexDirection="column">
        {blob && renderAudioWaves()}
        <Box display="flex" flex={1} flexDirection="row" justifyContent="space-between">
          <Text variant={TextVariantEnum.BODY1} className={classes.bytesVerticalItemTitle}>
            {formatBytes(size)}
          </Text>
          <Text variant={TextVariantEnum.BODY2} className={classes.durationVerticalItemTitle}>
            {duration}
          </Text>
        </Box>
      </Box>
    );

  if (type === "grid")
    return loading ? (
      renderCircularProgress
    ) : (
      <Box display="flex" flex={1} marginBottom={2} height={50} width="100%" flexDirection="column">
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Text variant={TextVariantEnum.BODY2} className={classes.bytesGridItemTitle}>
            {formatBytes(size)}
          </Text>
          <Text variant={TextVariantEnum.BODY2} className={classes.durationGridItemTitle}>
            {duration}
          </Text>
        </Box>
        {blob && renderAudioWaves()}
      </Box>
    );

  return null;
}
