import React, { useState, useMemo, useCallback } from "react";
import { TextVariantEnum, DirectoryNamesNCEnum } from "@/enums/*";
import FileIcon from "@/components/ui/FileIcon";
import { formatBytes, getExtensionFilename, downloadFile } from "@/utils/utils";
import { Box } from "@material-ui/core";
import Text from "@/components/ui/Text";
import theme from "@/styles/theme";
import IconButton from "@/components/ui/IconButton";
import { useRouter } from "next/router";
import { blobFile } from "@/services/webdav/files";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { toast } from "@/utils/notifications";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getFilename } from "@/utils/directory";
import { useTranslation } from "next-i18next";

type Props = {
  filename: string;
  size: number;
  mimetype?: string;
  name: string;
  canDeleteConversation: number;
};

export default function Default({ filename, mimetype, name, size, canDeleteConversation }: Props) {
  const { t } = useTranslation("honeycomb");
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const extension = useMemo(() => getExtensionFilename(filename), [filename]);
  const isFile = useMemo(() => extension, [extension]);
  const router = useRouter();

  const handleOpen = useCallback(() => {
    if (!isFile) {
      router.push(`/library/${filename}`);
    }
  }, [isFile, filename, router]);

  const avatar = useMemo(
    () => (
      <Box width={60} px={1} onClick={handleOpen}>
        <FileIcon extension={extension} mime={mimetype} type={isFile ? "file" : "directory"} />
      </Box>
    ),
    [handleOpen, extension, mimetype, isFile],
  );

  const download = useCallback(async () => {
    try {
      setLoadingDownload(true);
      let fileN = filename;
      if (canDeleteConversation === 1) {
        fileN = fileN.replace(`${DirectoryNamesNCEnum.TALK}/`, "");
      }

      const dataBlob = await blobFile(userRdx.user.id, fileN);
      if (dataBlob instanceof Blob) {
        downloadFile(dataBlob, getFilename(fileN), mimetype);
      }
    } catch (e) {
      console.log(e);
      toast(t("downloadFileFailed"), "error");
    } finally {
      setLoadingDownload(false);
    }
  }, [canDeleteConversation, filename, mimetype, t, userRdx.user.id]);

  return (
    <Box
      display="flex"
      flex={1}
      flexDirection="row"
      padding={1}
      borderRadius={4}
      // border={2}
      bgcolor="#f5f5f5"
      alignContent="center"
      minHeight={70}
      alignItems="center"
    >
      {avatar}
      <Box display="flex" flex={1} flexDirection="column" onClick={handleOpen}>
        <Box display="flex" flex={1} flexDirection="column" justifyContent="center">
          <Text variant={TextVariantEnum.CAPTION}>{name}</Text>
          {isFile && <Text variant={TextVariantEnum.CAPTION}>{formatBytes(size)}</Text>}
        </Box>
      </Box>
      {isFile && !loadingDownload && (
        <IconButton
          icon="download"
          iconStyle={{ fontSize: 20 }}
          handleClick={download}
          iconColor={theme.palette.secondary.main}
        />
      )}
      {isFile && loadingDownload && (
        <CircularProgress style={{ marginTop: 10, marginRight: 16 }} size={20} />
      )}
    </Box>
  );
}
