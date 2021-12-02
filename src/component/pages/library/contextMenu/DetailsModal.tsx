import React, { useEffect, useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { useTranslation } from "next-i18next";
import { LibraryCardItemInterface } from "@/interfaces/index";
import Grid from "@material-ui/core/Grid";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { getDataFile, getFileTags, ItemTagInterface } from "@/services/webdav/tags";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    overflow: "auto",
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
  cardItem: LibraryCardItemInterface;
};

export default function DetailsModal({ open, handleOpen, cardItem }: Props) {
  const { t } = useTranslation("library");
  const [isLoadingAdditionalData, setIsLoadingAdditionalData] = useState(true);
  const [data, setData] = useState<any>(cardItem);
  const [tags, setTags] = useState<ItemTagInterface[] | false>(false);
  const [hideAdditionalData, setHideAdditionalData] = useState(false);
  const classes = useStyles();
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  const getAdditionalDataFile = useCallback(async () => {
    try {
      const result: any = await getDataFile(userRdx.user.id, cardItem.filename);
      setData({ ...data, ...result });
      setIsLoadingAdditionalData(false);
      setHideAdditionalData(false);

      if (result.fileid) {
        const tags = await getFileTags(userRdx.user.id, cardItem.filename, result.fileid);
        setTags(tags);
      }
    } catch (e) {
      console.log(e);
      setIsLoadingAdditionalData(false);
      setHideAdditionalData(true);
    }
  }, [cardItem.filename, data, userRdx.user.id]);

  useEffect(() => {
    console.log(isLoadingAdditionalData);
    setIsLoadingAdditionalData(true);
    (async () => {
      await getAdditionalDataFile();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              {t("detailsTitle")}
            </h4>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                {t("detailsModal.name")}
              </Grid>
              <Grid item xs={6}>
                {data.basename}
              </Grid>
              <Grid item xs={6}>
                {t("detailsModal.path")}
              </Grid>
              <Grid item xs={6}>
                {data.filename}
              </Grid>
              {data.size && data.size > 0 && (
                <>
                  <Grid item xs={6}>
                    {t("detailsModal.size")}
                  </Grid>
                  <Grid item xs={6}>
                    {Math.round(data.size / 1024)} KiB
                  </Grid>
                </>
              )}
              {!hideAdditionalData && (
                <>
                  <Grid item xs={6}>
                    {t("detailsModal.description")}
                  </Grid>
                  <Grid item xs={6}>
                    {data.description}
                  </Grid>
                </>
              )}
              <Grid item xs={6}>
                {t("detailsModal.lastUpdate")}
              </Grid>
              <Grid item xs={6}>
                {data.createdAt?.toLocaleDateString("en-US")} - {data.createdAtDescription}
              </Grid>
              {!hideAdditionalData && (
                <>
                  <Grid item xs={6}>
                    {t("detailsModal.creator")}
                  </Grid>
                  <Grid item xs={6}>
                    {data["owner-display-name"]}
                  </Grid>
                </>
              )}
              <Grid item xs={6}>
                {t("detailsModal.type")}
              </Grid>
              <Grid item xs={6}>
                {data.mime}
              </Grid>
              {!hideAdditionalData && (
                <>
                  <Grid item xs={6}>
                    {t("detailsModal.fileId")}
                  </Grid>
                  <Grid item xs={6}>
                    {data.fileid}
                  </Grid>
                </>
              )}
              {!hideAdditionalData && (
                <>
                  <Grid item xs={6}>
                    {t("detailsModal.language")}
                  </Grid>
                  <Grid item xs={6}>
                    {data.language}
                  </Grid>
                </>
              )}
              {!hideAdditionalData && (
                <>
                  <Grid item xs={6}>
                    {t("detailsModal.tags")}
                  </Grid>
                  <Grid item xs={6}>
                    {tags &&
                      tags.map((tag: ItemTagInterface, index: number) => (
                        <span key={`tag-${tag.id}`}>
                          {tag["display-name"]}
                          {tags.length - 1 > index && ", "}
                        </span>
                      ))}
                  </Grid>
                </>
              )}
            </Grid>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
