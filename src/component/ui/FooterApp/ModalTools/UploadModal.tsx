import React, { useContext, useState, useRef, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { putFile, getUniqueName } from "@/services/webdav/files";
import { PropsLibrarySelector, PropsUserSelector } from "@/types/index";
import { useSelector, useDispatch } from "react-redux";
import Divider from "@/components/ui/Divider";
import {
  dateDescription,
  trailingSlash,
  getExtensionFilename,
  getRandomInt,
  removeFirstSlash,
} from "@/utils/utils";
import { addLibraryFile } from "@/store/actions/library";
import { LibraryItemInterface, TimeDescriptionInterface } from "@/interfaces/index";
import { EnvironmentEnum, NotificationStatusEnum } from "@/enums/*";
import CircularProgress from "@material-ui/core/CircularProgress";
import NotificationContext from "@/store/context/notification-context";
import { useTranslation } from "next-i18next";
import { blobToArrayBuffer } from "blob-util";
import { useRouter } from "next/router";
import { getOfflinePath, getRootPath } from "@/utils/directory";

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

export default function Upload({ open, handleClose }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const userId = userRdx.user.id;
  const library = useSelector((state: { library: PropsLibrarySelector }) => state.library);
  const path = library.currentPath;
  const pathExists = library.currentPathExists;
  const classes = useStyles();
  const router = useRouter();
  const notificationCtx = useContext(NotificationContext);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation("common");
  const timeDescription: TimeDescriptionInterface = t("timeDescription", { returnObjects: true });
  const dispatch = useDispatch();

  const handleUpload = (event: any) => {
    processUploadFiles(event.target.files);
  };

  const processUploadFiles = async (files: FileList) => {
    setIsLoading(true);

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < files.length; index++) {
      const file: File = files[index];
      try {
        // eslint-disable-next-line no-await-in-loop
        const content = await blobToArrayBuffer(file);
        // eslint-disable-next-line no-await-in-loop
        await uploadFile(file.name, content);
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

        notificationCtx.showNotification({
          message,
          status: NotificationStatusEnum.ERROR,
        });
      }
    }

    if (formRef.current) {
      formRef.current.reset();
    }

    // handleClose();

    router.push(`library/${removeFirstSlash(handledPath())}`);
  };

  const uploadFile = async (name: string, data: ArrayBuffer) => {
    const fileName = await handleFileName(name);
    const finalPath = `${trailingSlash(handledPath())}${fileName}`;

    const create = await putFile(userId, finalPath, data);
    if (create) {
      // addFileIntoLibrary(fileName, finalPath);
    }
  };

  const handleFileName = (name: string) => {
    let handledName = name;
    if (name[0] === ".") {
      handledName = getRandomInt(1, 9999) + name;
    }

    return getUniqueName(userId, handledPath(), handledName);
  };

  const addFileIntoLibrary = (name: string, finalPath: string) => {
    const date = new Date();
    const item: LibraryItemInterface = {
      basename: name,
      id: finalPath,
      filename: finalPath,
      type: "file",
      environment: EnvironmentEnum.REMOTE,
      createdAt: date,
      createdAtDescription: dateDescription(date, timeDescription),
      extension: getExtensionFilename(name),
    };

    dispatch(addLibraryFile(item));
  };

  const handledPath = useCallback(() => {
    const rootPath = getRootPath();

    return !pathExists || !path || path === "/" || path === getOfflinePath() ? rootPath : path;
  }, [path, pathExists]);

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
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
    </>
  );
}
