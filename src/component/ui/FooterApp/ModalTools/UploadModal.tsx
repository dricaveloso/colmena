import React, { useState, useRef, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { getUniqueName, chunkFileUpload } from "@/services/webdav/files";
import { PropsLibrarySelector, PropsUserSelector } from "@/types/index";
// import { useSelector, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Divider from "@/components/ui/Divider";
import {
  // dateDescription,
  trailingSlash,
  getExtensionFilename,
  getRandomInt,
  removeFirstSlash,
} from "@/utils/utils";
import { v4 as uuid } from "uuid";
// import { addLibraryFile } from "@/store/actions/library";
// import { LibraryItemInterface, TimeDescriptionInterface } from "@/interfaces/index";
// import { TimeDescriptionInterface } from "@/interfaces/index";
// import { EnvironmentEnum, NotificationStatusEnum } from "@/enums/*";
import CircularProgress from "@material-ui/core/CircularProgress";
import { toast } from "@/utils/notifications";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import {
  convertPrivateToUsername,
  convertUsernameToPrivate,
  getAudioPath,
  getRootPath,
} from "@/utils/directory";
import ActionConfirm from "@/components/ui/ActionConfirm";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { margin: theme.spacing(0, 0, 4, 0) },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
  },
  form: {
    "& .MuiTextField-root": {
      width: "100%",
    },
  },
  submit: {
    float: "right",
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

export default function Upload({ open, handleClose }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const userId = userRdx.user.id;
  const library = useSelector((state: { library: PropsLibrarySelector }) => state.library);
  const path = library.currentPath;
  const pathExists = library.currentPathExists;
  const classes = useStyles();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const { t } = useTranslation("common");
  const [filesInProgress, setFilesInProgress] = useState<FileInProgressInterface[]>([]);
  // const timeDescription: TimeDescriptionInterface
  // = t("timeDescription", { returnObjects: true });
  // const dispatch = useDispatch();

  const handledPath = useCallback(() => {
    const rootPath = getRootPath();

    return !pathExists ||
      !path ||
      path === "/" ||
      convertUsernameToPrivate(path, userId) === getAudioPath()
      ? convertPrivateToUsername(rootPath, userId)
      : path;
  }, [path, pathExists, userId]);

  const handleUpload = (event: any) => {
    prepareFiles(event.target.files);
  };

  const prepareFiles = (files: FileList) => {
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
    processUploadFiles(newFiles);
  };

  const processUploadFiles = async (files: FileInProgressInterface[]) => {
    setIsLoading(true);

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < files.length; index++) {
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

    if (formRef.current) {
      formRef.current.reset();
    }

    // handleClose();

    router.push(`/library/${removeFirstSlash(handledPath())}`);
  };

  const uploadFile = async (file: File) => {
    const fileName = await handleFileName(file.name);
    const finalPath = `${trailingSlash(handledPath())}${fileName}`;

    const create = await chunkFileUpload(userId, file, convertUsernameToPrivate(finalPath, userId));
    if (create) {
      // addFileIntoLibrary(fileName, finalPath);
    }
  };

  const handleFileName = (name: string) => {
    let handledName = name;
    if (name[0] === ".") {
      handledName = getRandomInt(1, 9999) + name;
    }

    const onlyName = handledName.replace(/\..*$/, "");
    const extension = getExtensionFilename(handledName);
    const finalName = `${onlyName.substr(0, 60)}.${extension}`;

    return getUniqueName(userId, convertUsernameToPrivate(handledPath(), userId), finalName);
  };

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

  // const addFileIntoLibrary = (name: string, finalPath: string) => {
  //   const date = new Date();
  //   const item: LibraryItemInterface = {
  //     basename: name,
  //     id: finalPath,
  //     filename: finalPath,
  //     type: "file",
  //     environment: EnvironmentEnum.REMOTE,
  //     createdAt: date,
  //     createdAtDescription: dateDescription(date, timeDescription),
  //     extension: getExtensionFilename(name),
  //   };

  //   dispatch(addLibraryFile(item));
  // };

  const confirmClose = useCallback(() => {
    if (isLoading) {
      setShowConfirmCancel(true);
    } else {
      handleClose();
    }
  }, [handleClose, isLoading]);

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={confirmClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h4 id="transition-modal-title" className={classes.title}>
              {t("uploadTitle")}
            </h4>
            <form ref={formRef}>
              <input
                type="file"
                style={{ display: "none" }}
                id="upload-file"
                multiple
                onChange={handleUpload}
              />
              <TextField
                id="outlined-search"
                label={t("form.local")}
                variant="outlined"
                value={handledPath()}
                disabled
              />
              <Divider marginTop={20} />
              <label htmlFor="upload-file">
                <Button
                  component="span"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress color="secondary" size={16} style={{ marginRight: 8 }} />
                      {t("loading")}..
                    </>
                  ) : (
                    t("form.upload")
                  )}
                </Button>
              </label>
            </form>
          </div>
        </Fade>
      </Modal>
      {showConfirmCancel && (
        <ActionConfirm
          title={t("confirmCancelUpload")}
          onOk={handleClose}
          onClose={() => setShowConfirmCancel(false)}
        />
      )}
    </>
  );
}
