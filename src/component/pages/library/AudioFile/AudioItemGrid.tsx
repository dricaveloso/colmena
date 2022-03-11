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
import Waves from "@/components/pages/file/AudioWave/Waves";
import { listFile } from "@/services/webdav/files";
import CircularProgress from "@material-ui/core/CircularProgress";
import { prepareAudioBlob } from "./AudioItemPreview";
import { toast } from "@/utils/notifications";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

type Props = {
  filename: string;
  environment: Environment;
  primary: string | React.ReactNode;
  size: number;
  arrayBufferBlob?: ArrayBuffer;
  audioState: "play" | "pause";
  handleAudioFinish: () => void;
};

const useStyles = makeStyles(() => ({
  gridItemTitle: {
    fontSize: 12.5,
    textAlign: "center",
  },
  durationBytesGridItemTitle: {
    fontSize: 10,
    textAlign: "center",
    color: "gray",
  },
}));

export default function AudioItemGrid({
  filename,
  environment,
  primary,
  size,
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
      toast(c("genericErrorMessage"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return loading ? (
    <Box display="flex" flex={1} height={60} justifyContent="center" alignItems="center">
      <CircularProgress size={20} />
    </Box>
  ) : (
    <Box display="flex" flex={1} style={{ width: "100%" }} flexDirection="column">
      <Text variant={TextVariantEnum.BODY1} className={classes.gridItemTitle}>
        {primary}
      </Text>
      <Text variant={TextVariantEnum.BODY2} className={classes.durationBytesGridItemTitle}>
        {`${duration} - ${formatBytes(size)}`}
      </Text>
      {blob && (
        <Waves
          blob={blob}
          config={{ height: 20 }}
          play={audioState === "play"}
          pause={audioState === "pause"}
          handleAudioFinish={handleAudioFinish}
        />
      )}
    </Box>
  );
}
