/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import TextField from "@material-ui/core/TextField";
import Divider from "@/components/ui/Divider";
import { Formik, Form, Field, FieldProps } from "formik";
import { Grid } from "@material-ui/core";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import * as Yup from "yup";
import { getUserGroup } from "@/utils/permissions";
import { ConfigFilesNCEnum, SelectVariantEnum } from "@/enums/index";
import { listFile, putFile } from "@/services/webdav/files";
import { useSelector, useDispatch } from "react-redux";
import { PropsUserSelector, SocialMediasAvailable } from "@/types/index";
import { MediaInfoInterface, SocialMediaInfoInterface } from "@/interfaces/index";
import { mediaInfoUpdate } from "@/store/actions/users/index";
import { toast } from "@/utils/notifications";
import { isValidUrl, getAvailableSocialMedias, capitalizeFirstLetter } from "@/utils/utils";
import Select from "@/components/ui/Select";

type Props = {
  title: string;
  open: boolean;
  handleClose: () => void;
};

interface MyFormValues {
  name: SocialMediasAvailable;
  url: string;
}

export default function Create({ title, open, handleClose }: Props) {
  const { t } = useTranslation("mediaProfile");
  const dispatch = useDispatch();
  const { t: c } = useTranslation("common");
  const [errorUrlMessage, setErrorUrlMessage] = useState("");
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  const socialMediasRegistered =
    userRdx.user.media && userRdx.user.media && Array.isArray(userRdx.user.media.social_medias)
      ? userRdx.user.media?.social_medias.map((item: SocialMediaInfoInterface) => item.name)
      : [];

  const initialValues = {
    name: "",
    url: "",
  };

  const schemaValidation = Yup.object().shape({
    name: Yup.string().required(c("form.requiredTitle")),
    url: Yup.string().required(c("form.requiredTitle")),
  });

  const handleSubmit = async (values: MyFormValues, setSubmitting: (flag: boolean) => void) => {
    const { name, url } = values;
    let urlSend = url;
    if (urlSend) {
      if (urlSend.indexOf("http://") === -1 && urlSend.indexOf("https://") === -1)
        urlSend = `http://${urlSend}`;
      if (!isValidUrl(urlSend)) {
        setSubmitting(false);
        setErrorUrlMessage(c("form.invalidURLTitle"));
        return;
      }
    }

    setSubmitting(true);
    try {
      const mediaName = getUserGroup();
      const mediaFile = await listFile(
        userRdx.user.id,
        `${mediaName}/${ConfigFilesNCEnum.MEDIA_PROFILE}`,
        null,
        true,
      );
      const mediaObj: MediaInfoInterface = JSON.parse(String(mediaFile));

      if (mediaObj.social_medias && Array.isArray(mediaObj.social_medias))
        mediaObj.social_medias.push({
          name,
          url: urlSend,
        });

      await putFile(
        userRdx.user.id,
        `${mediaName}/${ConfigFilesNCEnum.MEDIA_PROFILE}`,
        JSON.stringify(mediaObj),
      );

      dispatch(mediaInfoUpdate(mediaObj));

      toast(t("socialMediaInfoSaved"), "success");
      handleClose();
    } catch (e) {
      console.log(e);
      toast(t("genericErrorMessage"), "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={title} handleClose={handleClose} open={open}>
      <Formik
        validationSchema={schemaValidation}
        initialValues={initialValues}
        onSubmit={(values: MyFormValues, { setSubmitting }: any) => {
          handleSubmit(values, setSubmitting);
        }}
      >
        {({ submitForm, isSubmitting, errors, touched }: any) => (
          <Form>
            <Divider marginTop={20} />
            <Field name="name" data-testid="social-media-name" InputProps={{ notched: true }}>
              {({ field }: FieldProps) => (
                <Select
                  label={t("addSocialMedia.name")}
                  variant={SelectVariantEnum.OUTLINED}
                  options={getAvailableSocialMedias()
                    .filter((item: SocialMediasAvailable) => !socialMediasRegistered.includes(item))
                    .map((item) => ({
                      id: item,
                      value: capitalizeFirstLetter(item),
                    }))}
                  id="name"
                  {...field}
                />
              )}
            </Field>
            {errors.name && touched.name ? <ErrorMessageForm message={errors.name} /> : null}
            <Divider marginTop={20} />
            <Field name="url" data-testid="social-media-url" InputProps={{ notched: true }}>
              {({ field }: FieldProps) => (
                <TextField
                  id="url"
                  label={t("addSocialMedia.url")}
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    autoComplete: "off",
                  }}
                  multiline
                  maxRows={6}
                  {...field}
                />
              )}
            </Field>
            {errors.url && touched.url ? <ErrorMessageForm message={errors.url} /> : null}
            {errorUrlMessage ? <ErrorMessageForm message={errorUrlMessage} /> : null}
            <Divider marginTop={20} />
            <Grid container justifyContent="flex-end">
              <Button
                handleClick={submitForm}
                title={c("form.submitSaveTitle")}
                disabled={isSubmitting}
                isLoading={isSubmitting}
                data-testid="submit-add-social-media"
                type="submit"
              />
            </Grid>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
