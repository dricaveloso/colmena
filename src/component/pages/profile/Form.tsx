import React, { useContext } from "react";
import { useTranslation } from "next-i18next";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import NotificationContext from "@/store/notification-context";
import SocialMediaIconButton from "@/components/statefull/SocialMediaIconButtons";
import { ButtonVariantEnum, NotificationStatusEnum, SelectVariantEnum } from "@/enums/index";
import { makeStyles } from "@material-ui/styles";
import { Formik, Form, Field, FieldProps } from "formik";
import Divider from "@/components/ui/Divider";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";

type MyFormValues = {
  name: string;
  email: string;
  url?: string;
};

const useStyles = makeStyles({
  marginInputDivs: {
    "& > div": {
      marginBottom: 15,
    },
  },
});

export default function FormProfile() {
  const { t } = useTranslation("profile");
  const { t: c } = useTranslation("common");
  const notificationCtx = useContext(NotificationContext);
  const classes = useStyles();

  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required(c("form.requiredTitle")),
    email: Yup.string().email(c("form.invalidEmailTitle")).required(c("form.requiredTitle")),
    url: Yup.string().url(c("form.invalidURLTitle")),
  });

  const initialValues: MyFormValues = {
    name: "",
    email: "",
    url: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ValidationSchema}
      onSubmit={(values: MyFormValues, { setSubmitting }: any) => {
        setSubmitting(true);
        setTimeout(() => {
          notificationCtx.showNotification({
            message: c("form.successMessageFormSave"),
            status: NotificationStatusEnum.SUCCESS,
          });
          setSubmitting(false);
        }, 1000);

        console.log(values);
      }}
    >
      {({ submitForm, isSubmitting, errors, touched }: any) => (
        <Form>
          <Field name="name" InputProps={{ notched: true }}>
            {({ field }: FieldProps) => (
              <TextField
                id="name"
                label={t("nameField")}
                variant={SelectVariantEnum.OUTLINED}
                required
                fullWidth
                {...field}
              />
            )}
          </Field>
          {errors.name && touched.name ? <ErrorMessageForm message={errors.name} /> : null}
          <Divider marginTop={20} />
          <Field name="email" InputProps={{ notched: true }}>
            {({ field }: FieldProps) => (
              <TextField
                id="email"
                label={t("emailField")}
                variant={SelectVariantEnum.OUTLINED}
                required
                fullWidth
                {...field}
              />
            )}
          </Field>
          {errors.email && touched.email ? <ErrorMessageForm message={errors.email} /> : null}
          <Divider marginTop={20} />
          <Field name="url" InputProps={{ notched: true }}>
            {({ field }: FieldProps) => (
              <TextField
                id="url"
                label={t("urlField")}
                variant={SelectVariantEnum.OUTLINED}
                placeholder="http://www.test.com"
                required
                fullWidth
                {...field}
              />
            )}
          </Field>
          {errors.url && touched.url ? <ErrorMessageForm message={errors.url} /> : null}
          <Divider marginTop={20} />
          <div className={classes.marginInputDivs}>
            <Text>{t("socialMediaTitle")}</Text>
            <div className="boxRowCenter marginTop15">
              <SocialMediaIconButton />
            </div>
            <Divider marginTop={20} />
            {isSubmitting && <LinearProgress />}
            <div className="marginTop15">
              <Button title={t("saveButton")} handleClick={submitForm} />
            </div>
            <div className="marginTop15">
              <Button
                title={t("resetPasswordButton")}
                variant={ButtonVariantEnum.OUTLINED}
                handleClick={() =>
                  notificationCtx.showNotification({
                    message: c("featureUnavailable"),
                    status: NotificationStatusEnum.WARNING,
                  })
                }
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
