import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { LibraryCardItemInterface } from "@/interfaces/index";
import Grid from "@material-ui/core/Grid";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { getFileTags, ItemTagInterface } from "@/services/webdav/tags";
import Modal from "@/components/ui/Modal";

type Props = {
  open: boolean;
  handleOpen: (opt: boolean) => void;
  cardItem: LibraryCardItemInterface;
};

export default function DetailsModal({ open, handleOpen, cardItem }: Props) {
  const { t } = useTranslation("library");
  const [tags, setTags] = useState<ItemTagInterface[] | false>(false);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  const getAdditionalDataFile = useCallback(async () => {
    try {
      const tags = await getFileTags(userRdx.user.id, cardItem.filename, cardItem.fileId);
      setTags(tags);
    } catch (e) {
      console.log(e);
    }
  }, [cardItem.fileId, cardItem.filename, userRdx.user.id]);

  useEffect(() => {
    (async () => {
      await getAdditionalDataFile();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      data-testid="modal-item-details"
      title={t("detailsTitle")}
      handleClose={() => handleOpen(false)}
      open={open}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <strong>{t("detailsModal.name")}</strong>
        </Grid>
        <Grid item xs={6}>
          {cardItem.basename}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <strong>{t("detailsModal.path")}</strong>
        </Grid>
        <Grid item xs={6}>
          {cardItem.filename}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <strong>{t("detailsModal.size")}</strong>
        </Grid>
        <Grid item xs={6}>
          {cardItem.size ? <>{cardItem.sizeFormatted}</> : "-"}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <strong>{t("detailsModal.description")}</strong>
        </Grid>
        <Grid item xs={6}>
          {cardItem.description ?? "-"}
        </Grid>
      </Grid>
      {cardItem.createdAt && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <strong>{t("detailsModal.createdAt")}</strong>
          </Grid>
          <Grid item xs={6}>
            {cardItem.createdAt?.toLocaleDateString("en-US")} - {cardItem.createdAtDescription}
          </Grid>
        </Grid>
      )}

      {cardItem.updatedAt && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <strong>{t("detailsModal.lastUpdate")}</strong>
          </Grid>
          <Grid item xs={6}>
            {cardItem.updatedAt?.toLocaleDateString("en-US")} - {cardItem.updatedAtDescription}
          </Grid>
        </Grid>
      )}

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <strong>{t("detailsModal.creator")}</strong>
        </Grid>
        <Grid item xs={6}>
          {cardItem.ownerName ? cardItem.ownerName : "-"}
        </Grid>
      </Grid>
      {cardItem.type === "file" && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <strong>{t("detailsModal.type")}</strong>
          </Grid>
          <Grid item xs={6}>
            {cardItem.mime}
          </Grid>
        </Grid>
      )}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <strong>{t("detailsModal.fileId")}</strong>
        </Grid>
        <Grid item xs={6}>
          {cardItem.fileId ?? "-"}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <strong>{t("detailsModal.language")}</strong>
        </Grid>
        <Grid item xs={6}>
          {cardItem.language ?? "-"}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <strong>{t("detailsModal.tags")}</strong>
        </Grid>
        <Grid item xs={6}>
          {!tags && "-"}
          {tags &&
            tags.map((tag: ItemTagInterface, index: number) => (
              <span key={`tag-${tag.id}`}>
                {tag["display-name"]}
                {tags.length - 1 > index && ", "}
              </span>
            ))}
        </Grid>
      </Grid>
    </Modal>
  );
}
