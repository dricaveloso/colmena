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
import { getUserGroup } from "@/utils/permissions";
import { ConfigFilesNCEnum } from "@/enums/index";
import { listFile, putFile } from "@/services/webdav/files";
import { useSelector, useDispatch } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import { MediaInfoInterface, SocialMediaInfoInterface } from "@/interfaces/index";
import { mediaInfoUpdate } from "@/store/actions/users/index";
import { toast } from "@/utils/notifications";
import { isValidUrl, capitalizeFirstLetter } from "@/utils/utils";
import * as Yup from "yup";

type Props = {
  title: string;
  open: boolean;
  handleClose: () => void;
  socialMediaSelected: SocialMediaInfoInterface | null;
};

interface MyFormValues {
  name: string;
  url: string;
}

export default function Edit({ title, open, handleClose, socialMediaSelected }: Props) {
  const { t } = useTranslation("mediaProfile");
  const dispatch = useDispatch();
  const { t: c } = useTranslation("common");
  const [errorUrlMessage, setErrorUrlMessage] = useState("");
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  const name = socialMediaSelected?.name || "";

  const initialValues = {
    name: capitalizeFirstLetter(name),
    url: socialMediaSelected?.url || "",
  };

  const handleSubmit = async (values: MyFormValues, setSubmitting: (flag: boolean) => void) => {
    const { url } = values;
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
        {
          username: userRdx.user.id,
          password: userRdx.user.password,
        },
        true,
      );
      const mediaObj: MediaInfoInterface = JSON.parse(String(mediaFile));

      if (mediaObj.social_medias) {
        mediaObj.social_medias.map((item: SocialMediaInfoInterface) => {
          if (item.name.toLowerCase() === socialMediaSelected?.name.toLowerCase()) {
            // eslint-disable-next-line no-param-reassign
            item.url = url;
          }
          return item;
        });
      }

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

  const schemaValidation = Yup.object().shape({
    url: Yup.string().required(c("form.requiredTitle")),
  });

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
                <TextField
                  id="name"
                  label={t("addSocialMedia.name")}
                  variant="outlined"
                  fullWidth
                  disabled
                  inputProps={{
                    autoComplete: "off",
                  }}
                  multiline
                  {...field}
                />
              )}
            </Field>
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
                data-testid="submit-update-social-media"
                type="submit"
              />
            </Grid>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
