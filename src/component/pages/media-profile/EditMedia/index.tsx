/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
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
import { ConfigFilesNCEnum, ButtonVariantEnum } from "@/enums/index";
import { listFile, putFile } from "@/services/webdav/files";
import { useSelector, useDispatch } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import { MediaInfoInterface } from "@/interfaces/index";
import { mediaInfoUpdate } from "@/store/actions/users/index";
import { toast } from "@/utils/notifications";
import theme from "@/styles/theme";

type Props = {
  title: string;
  open: boolean;
  handleClose: () => void;
};

interface MyFormValues {
  // name: string;
  description: string;
  url: string;
}

export default function EditMedia({ title, open, handleClose }: Props) {
  const { t } = useTranslation("mediaProfile");
  const dispatch = useDispatch();
  const { t: c } = useTranslation("common");
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  const initialValues = {
    // name: userRdx.user.media?.name,
    description: userRdx.user.media?.slogan,
    url: userRdx.user.media?.url,
  };

  // const maxLengthName = 100;
  const maxLengthDescription = 200;

  const schemaValidation = Yup.object().shape({
    // name: Yup.string()
    //   .required(c("form.requiredTitle"))
    //   .max(maxLengthName, c("form.passwordMaxLengthTitle", { size: maxLengthName })),
    description: Yup.string()
      .required(c("form.requiredTitle"))
      .max(maxLengthDescription, c("form.passwordMaxLengthTitle", { size: maxLengthDescription })),
    url: Yup.string().nullable().url(c("form.URLInvalid")),
  });

  const handleSubmit = async (values: MyFormValues, setSubmitting: (flag: boolean) => void) => {
    const { description, url } = values;
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
      // mediaObj.name = name;
      mediaObj.slogan = description;
      mediaObj.url = url;

      await putFile(
        userRdx.user.id,
        `${mediaName}/${ConfigFilesNCEnum.MEDIA_PROFILE}`,
        JSON.stringify(mediaObj),
        {
          username: userRdx.user.id,
          password: userRdx.user.password,
        },
      );

      dispatch(mediaInfoUpdate(mediaObj));

      toast(t("mediaProfileInfoSaved"), "success");
      handleClose();
    } catch (e) {
      console.log(e);
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
            {/* <Field name="name" data-testid="media-name" InputProps={{ notched: true }}>
              {({ field }: FieldProps) => (
                <TextField
                  id="name"
                  label={t("editForm.name")}
                  variant="outlined"
                  inputProps={{
                    autoComplete: "off",
                    maxLength: maxLengthName,
                  }}
                  fullWidth
                  {...field}
                />
              )}
            </Field>
            {errors.name && touched.name ? <ErrorMessageForm message={errors.name} /> : null} */}
            <Divider marginTop={20} />
            <Field
              name="description"
              data-testid="media-description"
              InputProps={{ notched: true }}
            >
              {({ field }: FieldProps) => (
                <TextField
                  id="description"
                  label={t("editForm.slogan")}
                  variant="outlined"
                  inputProps={{
                    autoComplete: "off",
                    maxLength: maxLengthDescription,
                  }}
                  fullWidth
                  multiline
                  {...field}
                />
              )}
            </Field>
            {errors.description && touched.description ? (
              <ErrorMessageForm message={errors.description} />
            ) : null}
            <Divider marginTop={20} />
            <Field name="url" data-testid="media-url" InputProps={{ notched: true }}>
              {({ field }: FieldProps) => (
                <TextField
                  id="url"
                  label={t("editForm.url")}
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
            <Divider marginTop={20} />
            <Grid container justifyContent="space-between">
              <Button
                handleClick={handleClose}
                title={t("buttonCancelModalDialogInvite")}
                data-testid="close-modal-invite"
                variant={ButtonVariantEnum.OUTLINED}
              />
              <Button
                handleClick={submitForm}
                title={c("form.submitSaveTitle")}
                disabled={isSubmitting}
                isLoading={isSubmitting}
                style={{ backgroundColor: theme.palette.variation1.main }}
                data-testid="submit-edit-media"
                type="submit"
              />
            </Grid>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
