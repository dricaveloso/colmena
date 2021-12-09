/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Environment, PropsUserSelector } from "@/types/*";
import { EnvironmentEnum, TextVariantEnum } from "@/enums/*";
import { findByBasename } from "@/store/idb/models/files";
import Text from "@/components/ui/Text";
import Box from "@material-ui/core/Box";
import { removeSpecialCharacters, fancyTimeFormat, formatBytes } from "@/utils/utils";
import { useSelector } from "react-redux";
import { createObjectURL, arrayBufferToBlob } from "blob-util";
import Waves from "@/components/pages/file/AudioWave/Waves";
import getBlobDuration from "get-blob-duration";

type Props = {
  filename: string;
  environment: Environment;
  primary: string | React.ReactNode;
  size: number;
};

export default function AudioItemVertical({ filename, environment, primary, size }: Props) {
  const [loading, setLoading] = useState(false);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [urlBlob, setUrlBlob] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    (async () => {
      try {
        if (environment === EnvironmentEnum.LOCAL || environment === EnvironmentEnum.BOTH) {
          const localFile = await findByBasename(
            userRdx.user.id,
            removeSpecialCharacters(filename),
          );
          const blob = arrayBufferToBlob(localFile?.arrayBufferBlob);
          const urlBlob = createObjectURL(blob);
          const duration = await getBlobDuration(urlBlob);
          setDuration(fancyTimeFormat(duration));
          setUrlBlob(urlBlob);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return loading ? (
    <span>aguarde...</span>
  ) : (
    <Box display="flex" flexDirection="column">
      <Text variant={TextVariantEnum.BODY1} style={{ fontSize: 10 }}>
        {primary}
      </Text>
      <Text variant={TextVariantEnum.BODY2} style={{ fontSize: 10, color: "gray" }}>
        {`${duration} - ${formatBytes(size)}`}
      </Text>
      {urlBlob && <Waves audioURL={urlBlob} config={{ height: 20 }} />}
    </Box>
  );
}
