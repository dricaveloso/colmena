import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { useTranslation } from "next-i18next";
import { LibraryCardItemInterface } from "@/interfaces/index";
import Grid from "@material-ui/core/Grid";

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
  cardItem: LibraryCardItemInterface;
};

export default function DetailsModal({ open, handleOpen, cardItem }: Props) {
  const { t } = useTranslation("library");
  const classes = useStyles();

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
                {cardItem.basename}
              </Grid>
              <Grid item xs={6}>
                {t("detailsModal.path")}
              </Grid>
              <Grid item xs={6}>
                {cardItem.filename}
              </Grid>
              <Grid item xs={6}>
                {t("detailsModal.lastUpdate")}
              </Grid>
              <Grid item xs={6}>
                {cardItem.createdAt?.toLocaleDateString("en-US")} - {cardItem.createdAtDescription}
              </Grid>
              {cardItem.type === "file" && (
                <>
                  {cardItem.size && cardItem.size > 0 && (
                    <>
                      <Grid item xs={6}>
                        {t("detailsModal.size")}
                      </Grid>
                      <Grid item xs={6}>
                        {Math.round(cardItem.size / 1024)} KB
                      </Grid>
                    </>
                  )}
                  <Grid item xs={6}>
                    {t("detailsModal.type")}
                  </Grid>
                  <Grid item xs={6}>
                    {cardItem.mime}
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
