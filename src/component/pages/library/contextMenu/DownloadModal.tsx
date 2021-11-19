import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@/components/ui/Button";
import { useTranslation } from "next-i18next";
import { downloadLink } from "@/services/webdav/files";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";

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
  handleOpen: (opt: boolean) => void;
  filename: string;
  basename: string;
};

export default function DownloadModal({ open, handleOpen, filename, basename }: Props) {
  const { t } = useTranslation("library");
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [urlDownload, setUrlDownload] = useState<string | boolean>("");
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  useEffect(() => {
    if (open === true && urlDownload === "") {
      setIsLoading(true);
      (async () => {
        const url: string | boolean = await downloadLink(userRdx.user.id, filename);
        setUrlDownload(url);
        setIsLoading(false);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filename]);

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
            <h4 id="transition-modal-title" className={classes.title}>
              {t("downloadTitle")}
            </h4>
            {urlDownload === false ? (
              <>{t("messages.cannotDownloadFile")}</>
            ) : (
              <Button
                title={
                  <>
                    {t("downloadButton")} -&nbsp;<strong>{basename}</strong>
                  </>
                }
                className={classes.submit}
                disabled={isLoading}
                isLoading={isLoading}
                url={urlDownload.toString()}
                download={basename}
              />
            )}
          </div>
        </Fade>
      </Modal>
    </>
  );
}
