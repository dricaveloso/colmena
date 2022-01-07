import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { LibraryCardItemInterface } from "@/interfaces/index";
import Grid from "@material-ui/core/Grid";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { getFileTags, ItemTagInterface } from "@/services/webdav/tags";
import { getDataFile } from "@/services/webdav/files";
import Modal from "@/components/ui/Modal";

type Props = {
  open: boolean;
  handleOpen: (opt: boolean) => void;
  cardItem: LibraryCardItemInterface;
};

export default function DetailsModal({ open, handleOpen, cardItem }: Props) {
  const { t } = useTranslation("library");
  const [data, setData] = useState<any>(cardItem);
  const [tags, setTags] = useState<ItemTagInterface[] | false>(false);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  const getAdditionalDataFile = useCallback(async () => {
    try {
      const result: any = await getDataFile(cardItem.filename);
      setData({ ...data, ...result });

      if (result.fileid) {
        const tags = await getFileTags(userRdx.user.id, cardItem.filename, result.fileid);
        setTags(tags);
      }
    } catch (e) {
      console.log(e);
    }
  }, [cardItem.filename, data, userRdx.user.id]);

  useEffect(() => {
    (async () => {
      await getAdditionalDataFile();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal title={t("detailsTitle")} handleClose={() => handleOpen(false)} open={open}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <strong>{t("detailsModal.name")}</strong>
        </Grid>
        <Grid item xs={6}>
          {data.basename}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <strong>{t("detailsModal.path")}</strong>
        </Grid>
        <Grid item xs={6}>
          {data.filename}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <strong>{t("detailsModal.size")}</strong>
        </Grid>
        <Grid item xs={6}>
          {data?.size ? <>{Math.round(data.size / 1024)} KiB</> : "-"}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <strong>{t("detailsModal.description")}</strong>
        </Grid>
        <Grid item xs={6}>
          {data?.description ?? "-"}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <strong>{t("detailsModal.lastUpdate")}</strong>
        </Grid>
        <Grid item xs={6}>
          {data.createdAt?.toLocaleDateString("en-US")} - {data.createdAtDescription}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <strong>{t("detailsModal.creator")}</strong>
        </Grid>
        <Grid item xs={6}>
          {typeof data["owner-display-name"] === "string" ? data["owner-display-name"] : "-"}
        </Grid>
      </Grid>
      {data.type === "file" && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <strong>{t("detailsModal.type")}</strong>
          </Grid>
          <Grid item xs={6}>
            {data.mime}
          </Grid>
        </Grid>
      )}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <strong>{t("detailsModal.fileId")}</strong>
        </Grid>
        <Grid item xs={6}>
          {data?.fileid ?? "-"}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <strong>{t("detailsModal.language")}</strong>
        </Grid>
        <Grid item xs={6}>
          {data.language ?? "-"}
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
