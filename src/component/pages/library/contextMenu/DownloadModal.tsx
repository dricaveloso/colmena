import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { useTranslation } from "next-i18next";
import { blobFile } from "@/services/webdav/files";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import CircularProgress from "@material-ui/core/CircularProgress";
import { arrayBufferToBlob } from "blob-util";
import { downloadFile } from "@/utils/utils";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
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
    display: "none",
  },
  loading: {
    textAlign: "center",
  },
}));

type Props = {
  open: boolean;
  handleOpen: (opt: boolean) => void;
  filename: string;
  basename: string;
  mime?: string;
  arrayBufferBlob?: ArrayBuffer | undefined;
};

export default function DownloadModal({
  open,
  handleOpen,
  filename,
  basename,
  mime,
  arrayBufferBlob,
}: Props) {
  const { t } = useTranslation("library");
  const classes = useStyles();
  const [downloadError, setDownloadError] = useState<boolean>(false);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  useEffect(() => {
    if (open === true) {
      (async () => {
        setDownloadError(false);
        let dataBlob: Blob | null | boolean = null;
        if (arrayBufferBlob) {
          dataBlob = localUrlDownload(arrayBufferBlob);
        } else {
          dataBlob = await blobFile(userRdx.user.id, filename);
        }

        if (dataBlob instanceof Blob) {
          downloadFile(dataBlob, basename, mime);
          handleOpen(false);
        } else {
          setDownloadError(true);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filename, arrayBufferBlob]);

  const localUrlDownload = (arrayBufferBlob: ArrayBuffer) => arrayBufferToBlob(arrayBufferBlob);

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => handleOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            {downloadError === true ? (
              <>{t("messages.cannotDownloadFile")}</>
            ) : (
              <>
                <div className={classes.loading}>
                  <CircularProgress color="secondary" size={16} style={{ marginRight: 8 }} />{" "}
                  {t("downloading")}
                </div>
              </>
            )}
          </div>
        </Fade>
      </Modal>
    </>
  );
}
