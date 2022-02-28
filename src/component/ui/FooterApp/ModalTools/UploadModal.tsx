import React, { useState, useRef, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@/components/ui/Modal";
import { getUniqueName, chunkFileUpload, abortUpload } from "@/services/webdav/files";
import { PropsLibrarySelector, PropsUserSelector } from "@/types/index";
import { useSelector } from "react-redux";
import Divider from "@/components/ui/Divider";
import Button from "@/components/ui/Button";
import { trailingSlash, getExtensionFilename, getRandomInt, removeFirstSlash } from "@/utils/utils";
import { v4 as uuid } from "uuid";
import { toast } from "@/utils/notifications";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import LibraryModal from "@/components/ui/LibraryModal";
import { LibraryItemInterface } from "@/interfaces/index";
import { ButtonColorEnum, ButtonSizeEnum, ButtonVariantEnum, TextVariantEnum } from "@/enums/*";
import { Box } from "@material-ui/core";
import Text from "@/components/ui/Text";
import {
  convertPrivateToUsername,
  convertUsernameToPrivate,
  getRootPath,
  isPanal,
} from "@/utils/directory";
import ActionConfirm from "@/components/ui/ActionConfirm";
import { shareInChat } from "@/services/share/share";

const useStyles = makeStyles(() => ({
  form: {
    "& .MuiTextField-root": {
      width: "100%",
    },
  },
  submit: {
    marginLeft: 10,
  },
}));

type Props = {
  open: boolean;
  handleClose: () => void;
};

enum FileStatusEnum {
  PENDING = 0,
  UPLOADING = 1,
  DONE = 2,
}
interface FileInProgressInterface {
  id: number | string;
  file: File;
  status: FileStatusEnum;
}

let requestCancel = false;

export default function Upload({ open, handleClose }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const userId = userRdx.user.id;
  const library = useSelector((state: { library: PropsLibrarySelector }) => state.library);
  const currentLibraryPath = library.currentPath;
  const pathExists = library.currentPathExists;
  const classes = useStyles();
  const router = useRouter();
  const [cancelIsLoading, setCancelIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openLibrary, setOpenLibrary] = useState(false);
  const [path, setPath] = useState(currentLibraryPath);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [filesInProgress, setFilesInProgress] = useState<FileInProgressInterface[]>([]);
  const { t } = useTranslation("common");

  const handleUpload = async (event: any) => {
    await prepareFiles(event.target.files);
  };

  const handledPath = useCallback(() => {
    const rootPath = getRootPath();

    return !pathExists || !path || path === "/" ? convertPrivateToUsername(rootPath, userId) : path;
  }, [path, pathExists, userId]);

  const handleFileName = useCallback(
    (name: string) => {
      let handledName = name;
      if (name[0] === ".") {
        handledName = getRandomInt(1, 9999) + name;
      }

      const onlyName = handledName.replace(/^(.*)\..*$/, "$1");
      const extension = getExtensionFilename(handledName);
      const finalName = `${onlyName.substr(0, 60)}.${extension}`;

      return getUniqueName(userId, convertUsernameToPrivate(handledPath(), userId), finalName);
    },
    [handledPath, userId],
  );

  const cancelUpload = useCallback(() => {
    abortUpload();
    handleClose();
    toast(t("messages.uploadCanceledSuccessfully"), "success");
  }, [handleClose, t]);

  const updateFileInProgress = useCallback(
    (file: FileInProgressInterface, data) => {
      filesInProgress.map((item) => {
        if (file.id === item.id) {
          return {
            ...file,
            data,
          };
        }

        return item;
      });
    },
    [filesInProgress],
  );

  const uploadFile = useCallback(
    async (file: File) => {
      const fileName = await handleFileName(file.name);
      const finalPath = `${trailingSlash(handledPath())}${fileName}`;
      const realPath = convertUsernameToPrivate(handledPath(), userId);

      await chunkFileUpload(userId, file, convertUsernameToPrivate(finalPath, userId));

      if (isPanal(realPath)) {
        await shareInChat(realPath, finalPath);
      }
    },
    [handleFileName, handledPath, userId],
  );

  const resultMessage = useCallback(() => {
    if (!requestCancel) {
      if (formRef.current) {
        formRef.current.reset();
      }

      const timer = 5000;
      toast(t("messages.fileUploadedSuccessfully"), "success", { timer });
      setTimeout(() => {
        router.push(`/library/${removeFirstSlash(handledPath())}`);
      }, timer);
    }
  }, [handledPath, router, t]);

  const processUploadFiles = useCallback(
    async (files: FileInProgressInterface[]) => {
      setIsLoading(true);

      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < files.length; index++) {
        if (requestCancel) {
          break;
        }

        const fileInProgress: FileInProgressInterface = files[index];
        const { file } = fileInProgress;
        try {
          // eslint-disable-next-line no-await-in-loop
          // const content = await blobToArrayBuffer(file);
          updateFileInProgress(fileInProgress, {
            status: FileStatusEnum.UPLOADING,
          });
          // eslint-disable-next-line no-await-in-loop
          await uploadFile(file);

          updateFileInProgress(fileInProgress, {
            status: FileStatusEnum.DONE,
          });
        } catch (e) {
          let message = "";
          const fileName: string = file.name;
          switch (e?.response?.status) {
            case 413:
              message = t("messages.fileTooLarge", { fileName });
              break;
            default:
              message = t("messages.unableToProcessFile", { fileName });
          }

          toast(message, "error");
        }
      }

      setShowConfirmCancel(false);
      resultMessage();
    },
    [t, updateFileInProgress, uploadFile, resultMessage],
  );

  const prepareFiles = useCallback(
    async (files: FileList) => {
      setIsLoading(true);
      const newFiles: Array<FileInProgressInterface> = [];
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < files.length; index++) {
        newFiles.push({
          id: uuid(),
          file: files[index],
          status: FileStatusEnum.PENDING,
        });
      }

      setFilesInProgress([...filesInProgress, ...newFiles]);
      await processUploadFiles(newFiles);
    },
    [filesInProgress, processUploadFiles],
  );

  const confirmClose = useCallback(() => {
    if (isLoading) {
      setShowConfirmCancel(true);
    } else {
      handleClose();
    }
  }, [handleClose, isLoading]);

  const requestAbortUpload = () => {
    setCancelIsLoading(true);
    cancelUpload();
    requestCancel = true;
  };

  const libraryOptions = (item: LibraryItemInterface) => {
    if (item.type === "directory") {
      // return (
      //   <Button
      //     handleClick={() => handleChangeLocation(item.aliasFilename)}
      //     title={t("chooseLocationButton")}
      //     size={ButtonSizeEnum.SMALL}
      //   />
      // );
    }

    return null;
  };

  const footerActions = (item: LibraryItemInterface) => (
    <Button
      handleClick={() => handleChangeLocation(item.aliasFilename)}
      title={t("chooseLocationButton")}
      size={ButtonSizeEnum.SMALL}
    />
  );

  const handleChangeLocation = (path: string) => {
    setPath(path);
    setOpenLibrary(false);
  };

  return (
    <>
      <Modal
        data-testid="modal-file-upload"
        title={t("uploadTitle")}
        handleClose={isLoading ? undefined : confirmClose}
        open={open}
      >
        <form ref={formRef}>
          <input
            type="file"
            style={{ display: "none" }}
            id="upload-file"
            multiple
            onChange={handleUpload}
          />
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" flexDirection="column">
              <Text variant={TextVariantEnum.BODY1} style={{ fontWeight: "bold" }}>
                {t("form.local")}
              </Text>
              <Text variant={TextVariantEnum.BODY2}>{`/${handledPath()}`}</Text>
            </Box>
            <Button
              handleClick={() => setOpenLibrary(true)}
              style={{ margin: 8 }}
              variant={ButtonVariantEnum.TEXT}
              color={ButtonColorEnum.PRIMARY}
              title={t("changeLocationButton")}
              size={ButtonSizeEnum.SMALL}
            />
          </Box>
          <Divider marginTop={20} />
          <Box display="flex" justifyContent="flex-end" width="100%">
            {isLoading && (
              <Button
                handleClick={confirmClose}
                title={t("form.cancelButton")}
                data-cy="cancel"
                color={ButtonColorEnum.DEFAULT}
                variant={ButtonVariantEnum.OUTLINED}
              />
            )}
            <label htmlFor="upload-file">
              <Button
                data-cy="select-files"
                component="span"
                title={t("form.upload")}
                className={classes.submit}
                disabled={isLoading}
                isLoading={isLoading}
              />
            </label>
          </Box>
        </form>
      </Modal>
      <LibraryModal
        title={t("changeLocationModalTitle")}
        handleClose={() => setOpenLibrary(false)}
        open={openLibrary}
        options={libraryOptions}
        footerActions={footerActions}
      />
      {showConfirmCancel && (
        <ActionConfirm
          title={t("confirmCancelUpload")}
          onOk={requestAbortUpload}
          onClose={() => setShowConfirmCancel(false)}
          isLoading={cancelIsLoading}
        />
      )}
    </>
  );
}
