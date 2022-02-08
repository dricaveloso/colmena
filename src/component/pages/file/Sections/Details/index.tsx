import React from "react";
import { LibraryItemInterface } from "@/interfaces/index";
import Accordion from "@material-ui/core/Accordion";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { AccordionDetails, AccordionSummary, Typography, Grid } from "@material-ui/core";
import { useTranslation } from "next-i18next";

type Props = {
  data: LibraryItemInterface;
};

export default function DetailsSection({ data }: Props) {
  const { t: l } = useTranslation("library");

  return (
    <Accordion
      style={{
        marginTop: "16px",
        boxShadow: "none",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon htmlColor="white" />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        style={{
          backgroundColor: "#4C517F",
          color: "white",
        }}
      >
        <Typography
          style={{
            fontWeight: "bold",
          }}
        >
          {l("contextMenuOptions.details")}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <strong>{l("detailsModal.name")}</strong>
            </Grid>
            <Grid item xs={6}>
              {data.basename}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <strong>{l("detailsModal.path")}</strong>
            </Grid>
            <Grid item xs={6}>
              {data.filename}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <strong>{l("detailsModal.size")}</strong>
            </Grid>
            <Grid item xs={6}>
              {data.sizeFormatted}
            </Grid>
          </Grid>
          {data.createdAt && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <strong>{l("detailsModal.createdAt")}</strong>
              </Grid>
              <Grid item xs={6}>
                {data.createdAt?.toLocaleDateString("en-US")} - {data.createdAtDescription}
              </Grid>
            </Grid>
          )}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <strong>{l("detailsModal.lastUpdate")}</strong>
            </Grid>
            <Grid item xs={6}>
              {data.updatedAt?.toLocaleDateString("en-US")} - {data.updatedAtDescription}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <strong>{l("detailsModal.creator")}</strong>
            </Grid>
            <Grid item xs={6}>
              {data.ownerName}
            </Grid>
          </Grid>
          {data.type === "file" && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <strong>{l("detailsModal.type")}</strong>
              </Grid>
              <Grid item xs={6}>
                {data.mime}
              </Grid>
            </Grid>
          )}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <strong>{l("detailsModal.fileId")}</strong>
            </Grid>
            <Grid item xs={6}>
              {data.fileId ?? "-"}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <strong>{l("detailsModal.language")}</strong>
            </Grid>
            <Grid item xs={6}>
              {data.language ?? "-"}
            </Grid>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
