/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useState } from "react";
import FlexBox from "@/components/ui/FlexBox";
import Box from "@material-ui/core/Box";
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

import { Formik, Form, Field, FieldProps } from "formik";
import { Grid } from "@material-ui/core";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["file"])),
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
  const [loading, setLoading] = useState(false);
  const cookies = parseCookies();
  const language = cookies.NEXT_LOCALE || "en";
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    customdescription: data && decodeURI(data.customdescription) ? data.customdescription : "",
  };
  const getFile = async () => {
    try {
      setLoading(true);
      const result: any = await getDataFile(filename);
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
                    value={decodeURI(field.value)}
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
          </Box>
        </FlexBox>
      </LayoutApp>
    </>
  );
}

export default File;
