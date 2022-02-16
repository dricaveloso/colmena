import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { useTranslation } from "next-i18next";
import { getFileContents } from "@/services/webdav/files";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  LibraryItemContextMenuInterface,
  LibraryItemInterface,
  TimeDescriptionInterface,
} from "@/interfaces/index";
import { createFile, remove } from "@/store/idb/models/files";
import { getPath } from "@/utils/directory";
import { ContextMenuEventEnum, ContextMenuOptionEnum, EnvironmentEnum } from "@/enums/*";
import { dateDescription, getExtensionFilename } from "@/utils/utils";

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
  availableOffline: boolean;
  handleOpen: (opt: boolean) => void;
  cardItem: LibraryItemContextMenuInterface;
};

export default function SyncModal({ open, handleOpen, cardItem, availableOffline }: Props) {
  const { t } = useTranslation("library");
  const { t: c } = useTranslation("common");
  const classes = useStyles();
  const [downloadError, setDownloadError] = useState<boolean | string>(false);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const timeDescription: TimeDescriptionInterface = c("timeDescription", { returnObjects: true });

  useEffect(() => {
    if (open === true) {
      (async () => {
        setDownloadError(false);
        try {
          if (availableOffline) {
            await syncOfflinePath();
          } else {
            await deleteOfflinePath();
          }

          console.log("chegou aqui");
          handleOpen(false);
        } catch (e) {
          setDownloadError(e.message);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, cardItem, availableOffline]);

  const syncOfflinePath = useCallback(async () => {
    const result: any = await getFileContents(userRdx.user.id, cardItem.filename);
    if (!result?.data) {
      throw new Error(t("messages.cannotDownloadFile"));
    }

    const id: string = await createFile({
      arrayBufferBlob: result?.data,
      type: cardItem.mime,
      size: cardItem.size,
      createdAt: new Date(),
      userId: userRdx.user.id,
      filename: cardItem.filename,
      aliasFilename: cardItem.aliasFilename,
      path: getPath(cardItem.filename),
      basename: cardItem.basename,
      environment: EnvironmentEnum.BOTH,
    });

    if (!id) {
      throw new Error(t("messages.cannotDownloadFile"));
    }

    const date = new Date();
    const item: LibraryItemInterface = {
      ...cardItem,
      arrayBufferBlob: result?.data,
      id,
      type: "file",
      environment: EnvironmentEnum.BOTH,
      createdAt: date,
      createdAtDescription: dateDescription(date, timeDescription),
      extension: getExtensionFilename(cardItem.basename),
    };

    await cardItem.onChange(
      item,
      ContextMenuEventEnum.UPDATE,
      ContextMenuOptionEnum.AVAILABLE_OFFLINE,
      { oldId: cardItem.id },
    );
  }, [cardItem, t, timeDescription, userRdx.user.id]);

  const deleteOfflinePath = useCallback(async () => {
    await remove(cardItem.id, userRdx.user.id);
    await cardItem.onChange(
      { ...cardItem, environment: EnvironmentEnum.REMOTE },
      ContextMenuEventEnum.UPDATE,
      ContextMenuOptionEnum.AVAILABLE_OFFLINE,
      { oldId: cardItem.id },
    );
  }, [cardItem, userRdx.user.id]);

  return (
    <>
      <Modal
        data-testid="modal-available-offline"
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
              <>{downloadError}</>
            ) : (
              <>
                <div className={classes.loading}>
                  <CircularProgress color="secondary" size={16} style={{ marginRight: 8 }} />{" "}
                  {t("synchronizing")}
                </div>
              </>
            )}
          </div>
        </Fade>
      </Modal>
    </>
  );
}
