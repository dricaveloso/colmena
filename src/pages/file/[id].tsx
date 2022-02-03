/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useState } from "react";
import FlexBox from "@/components/ui/FlexBox";
import Box from "@material-ui/core/Box";
import Accordion from "@material-ui/core/Accordion";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { GetStaticProps, GetStaticPaths } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum } from "@/enums/index";
import { useSelector } from "react-redux";
import Chip from "@material-ui/core/Chip";
import Modal from "@/components/ui/Modal";
import { v4 as uuid } from "uuid";
import { PropsUserSelector } from "@/types/index";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import ListItemText from "@material-ui/core/ListItemText";
import { getFileTags, ItemTagInterface } from "@/services/webdav/tags";
import Button from "@/components/ui/Button";
import { getDataFile, setDataFile } from "@/services/webdav/files";
import TextField from "@material-ui/core/TextField";
import IconButton from "@/components/ui/IconButton";
import { toast } from "@/utils/notifications";
import Section from "@/components/pages/file/Section";
import Skeleton from "@material-ui/lab/Skeleton";
import { MemoizedAudioFile } from "@/components/pages/file/AudioFile";
import { parseCookies } from "nookies";
import Divider from "@/components/ui/Divider";
import { getFilename } from "@/utils/directory";
import theme from "@/styles/theme";
import { downloadFile } from "@/utils/utils";
// import { arrayBufferToBlob, createObjectURL } from "blob-util";

import { Formik, Form, Field, FieldProps } from "formik";
import { AccordionDetails, AccordionSummary, Grid } from "@material-ui/core";
import Avatar from "@/components/ui/Avatar";
import Typography from "@material-ui/core/Typography";
// import getBlobDuration from "get-blob-duration";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["file", "library"])),
  },
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

interface IForm {
  customdescription: string;
}

function File() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const router = useRouter();
  const { id } = router.query;
  const filename = atob(String(id));
  const [data, setData] = useState<any>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [tags, setTags] = useState<ItemTagInterface[]>([]);
  const { t } = useTranslation("file");
  const { t: c } = useTranslation("common");
  const { t: l } = useTranslation("library");
  const [loading, setLoading] = useState(false);
  const cookies = parseCookies();
  const language = cookies.NEXT_LOCALE || "en";
  const [isLoading, setIsLoading] = useState(false);
  // const [duration, setDuration] = useState(0);

  const initialValues = {
    customdescription: data && decodeURI(data.customdescription) ? data.customdescription : "",
  };
  const getFile = async () => {
    try {
      setLoading(true);
      const result: any = await getDataFile(filename);
      console.log(result);
      // const blobRes: any = await listFile(userRdx.user.id, filename);
      // const blob = arrayBufferToBlob(blobRes);
      // const audioURL = createObjectURL(blob);
      // const duration = await getBlobDuration(audioURL);
      // setDuration(duration);
      let tags: boolean | ItemTagInterface[] = false;
      if (result.fileid) {
        tags = await getFileTags(userRdx.user.id, filename, result.fileid);
      }

      setTags(!tags ? [] : tags);
      setData(result);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const showDescriptionField = () => {
    setOpenModal(!openModal);
  };

  useEffect(() => {
    getFile();
  }, [filename]);

  const editDescriptionField = async (values: IForm) => {
    const { customdescription } = values;
    setIsLoading(true);

    try {
      await setDataFile({ customdescription, language }, `${filename}`);
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setData({ ...data, customdescription });
      setIsLoading(false);
      setOpenModal(false);
      toast(t("messages.descriptionSuccessfullyUpdated"), "success");
    }
  };

  return (
    <>
      <Modal
        title={t("editDescription")}
        handleClose={() => setOpenModal(!openModal)}
        open={openModal}
      >
        <Formik initialValues={initialValues} onSubmit={(values) => editDescriptionField(values)}>
          {({ setFieldValue }: any) => (
            <Form>
              <Field name="customdescription" InputProps={{ notched: true }}>
                {({ field }: FieldProps) => (
                  <TextField
                    id="customdescription"
                    label={t("descriptionTitle")}
                    variant="outlined"
                    inputProps={{ maxLength: 60 }}
                    style={{
                      width: "100%",
                    }}
                    {...field}
                    value={field.value ? decodeURI(field.value) : ""}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                      setFieldValue("customdescription", event.target.value)
                    }
                  />
                )}
              </Field>
              <Divider marginTop={20} />
              <Grid container justifyContent="flex-end">
                <Button
                  title={c("form.submitSaveTitle")}
                  disabled={isLoading}
                  isLoading={isLoading}
                  type="submit"
                />
              </Grid>
            </Form>
          )}
        </Formik>
      </Modal>
      <LayoutApp
        title=""
        back
        drawer={false}
        extraElement={
          <IconButton
            icon="share"
            fontSizeIcon="small"
            iconColor="#fff"
            handleClick={() => toast(c("featureUnavailable"), "warning")}
            style={{ minWidth: 25 }}
          />
        }
      >
        <FlexBox
          justifyContent={JustifyContentEnum.FLEXSTART}
          extraStyle={{ padding: 0, margin: 0 }}
        >
          <Box width="100%">
            <div
              style={{
                backgroundColor: theme.palette.primary.main,
                height: "140px",
                display: "flex",
                padding: "0 16px",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div>
                <Avatar size={10} borderRadius="8px!important" />
              </div>
              <Grid container alignItems="baseline" direction="column">
                <Typography
                  style={{
                    color: theme.palette.primary.contrastText,
                    fontWeight: "bold",
                    marginLeft: "12px",
                  }}
                >
                  {getFilename(decodeURIComponent(filename))}
                </Typography>
                <IconButton
                  icon="download"
                  fontSizeIcon="small"
                  iconColor="#fff"
                  handleClick={() => downloadFile(data, filename, data.type)}
                  style={{ minWidth: 25, marginLeft: "4px", marginTop: "8px" }}
                />
              </Grid>
            </div>
            <MemoizedAudioFile filename={filename} data={data} />
            <Section
              title={t("descriptionTitle")}
              secondaryAction={
                <IconButton
                  icon="edit"
                  fontSizeIcon="small"
                  handleClick={() => showDescriptionField()}
                  style={{ minWidth: 25 }}
                />
              }
            >
              {loading ? (
                <Box display="flex" flex={1} flexDirection="column" justifyContent="space-between">
                  <Skeleton width="100%" />
                  <Skeleton width="70%" />
                  <Skeleton width="80%" />
                </Box>
              ) : data && data.customdescription ? (
                <ListItemText id="description-item" primary={decodeURI(data.customdescription)} />
              ) : (
                <ListItemText
                  id="description-item"
                  primaryTypographyProps={{ style: { color: "gray" } }}
                  primary="Update file description"
                />
              )}
            </Section>
            <Section
              title={t("tagTitle")}
              secondaryAction={
                <IconButton
                  icon="plus"
                  fontSizeIcon="small"
                  handleClick={() => toast(c("featureUnavailable"), "warning")}
                  style={{ minWidth: 25 }}
                />
              }
            >
              {loading ? (
                <Box display="flex" flex={1} flexDirection="row" justifyContent="flex-start">
                  <Skeleton style={{ marginRight: 10 }} width={80} height={30} />
                  <Skeleton style={{ marginRight: 10 }} width={50} height={30} />
                  <Skeleton style={{ marginRight: 10 }} width={90} height={30} />
                  <Skeleton style={{ marginRight: 10 }} width={70} height={30} />
                </Box>
              ) : (
                Array.isArray(tags) &&
                tags.length > 0 &&
                tags.map((item: ItemTagInterface) => (
                  <Chip key={uuid()} label={item["display-name"]} style={{ marginRight: 5 }} />
                ))
              )}
            </Section>
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
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <strong>{l("detailsModal.name")}</strong>
                    </Grid>
                    <Grid item xs={6}>
                      {getFilename(decodeURIComponent(filename))}
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <strong>{l("detailsModal.path")}</strong>
                    </Grid>
                    <Grid item xs={6}>
                      {filename}
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <strong>{l("detailsModal.size")}</strong>
                    </Grid>
                    <Grid item xs={6}>
                      {data?.size ? <>{Math.round(data.size / 1024)} KiB</> : "-"}
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <strong>{l("detailsModal.description")}</strong>
                    </Grid>
                    <Grid item xs={6}>
                      {data?.description ?? "-"}
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <strong>{l("detailsModal.lastUpdate")}</strong>
                    </Grid>
                    <Grid item xs={6}>
                      {data?.createdAt?.toLocaleDateString("en-US")} - {data?.createdAtDescription}
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <strong>{l("detailsModal.creator")}</strong>
                    </Grid>
                    {/* <Grid item xs={6}>
                      {typeof data["owner-display-name"] === "string"
                        ? data["owner-display-name"]
                        : "-"}
                    </Grid> */}
                  </Grid>
                  {data?.type === "file" && (
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <strong>{l("detailsModal.type")}</strong>
                      </Grid>
                      <Grid item xs={6}>
                        {data?.mime}
                      </Grid>
                    </Grid>
                  )}
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <strong>{l("detailsModal.fileId")}</strong>
                    </Grid>
                    <Grid item xs={6}>
                      {data?.fileid ?? "-"}
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <strong>{l("detailsModal.language")}</strong>
                    </Grid>
                    <Grid item xs={6}>
                      {data?.language ?? "-"}
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <strong>{l("detailsModal.tags")}</strong>
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
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        </FlexBox>
      </LayoutApp>
    </>
  );
}

export default File;
