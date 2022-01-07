import { useEffect, useState } from "react";
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

type Props = {
  filename: string;
  data: any | undefined;
};

export default function AudioFile({ filename, data }: Props) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [loading, setLoading] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const { t } = useTranslation("file");

  const getListFile = async () => {
    try {
      setLoading(true);
      const blobResult: any = await listFile(userRdx.user.id, filename);
      const blob = arrayBufferToBlob(blobResult);
      setBlob(blob);
      console.log(blob);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListFile();
  }, []);

  return (
    <Section
      title={t("audioTitle")}
      secondaryAction={<ContextMenuFile filename={filename} blob={blob} data={data} />}
    >
      {loading ? (
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
            <Skeleton variant="text" width={40} />
          </Box>
        </Box>
      ) : (
        <AudioWave blob={blob} data={data} />
      )}
    </Section>
  );
}
