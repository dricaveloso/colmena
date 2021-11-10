import React, { useContext } from "react";
import { useTranslation } from "next-i18next";
// import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import NotificationContext from "@/store/context/notification-context";
// import SocialMediaIconButton from "@/components/statefull/SocialMediaIconButtons";
import { ButtonVariantEnum, NotificationStatusEnum, SelectVariantEnum } from "@/enums/index";
import { makeStyles } from "@material-ui/styles";
import { Formik, Form, Field, FieldProps } from "formik";
import Divider from "@/components/ui/Divider";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";

type MyFormValues = {
  name?: string;
  email: string;
  lastName?: string;
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
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const notificationCtx = useContext(NotificationContext);
  const classes = useStyles();

  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required(c("form.requiredTitle")),
    email: Yup.string().email(c("form.invalidEmailTitle")).required(c("form.requiredTitle")),
    lastName: Yup.string().required(c("form.requiredTitle")),
  });

  const initialValues: MyFormValues = {
    name: userRdx.user.name,
    email: userRdx.user.email,
    lastName: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ValidationSchema}
      onSubmit={(values: MyFormValues, { setSubmitting }: any) => {
        setSubmitting(true);
        notificationCtx.showNotification({
          message: c("featureUnavailable"),
          status: NotificationStatusEnum.WARNING,
        });
        setSubmitting(false);
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
          <Field name="lastName" InputProps={{ notched: true }}>
            {({ field }: FieldProps) => (
              <TextField
                id="lastName"
                label="Sobrenome"
                variant={SelectVariantEnum.OUTLINED}
                required
                fullWidth
                {...field}
              />
            )}
          </Field>
          {errors.lastName && touched.lastName ? (
            <ErrorMessageForm message={errors.lastName} />
          ) : null}
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
          <div className={classes.marginInputDivs}>
            {/* <Text>{t("socialMediaTitle")}</Text>
            <div className="boxRowCenter marginTop15">
              <SocialMediaIconButton />
            </div> */}
            {/* <Divider marginTop={20} /> */}
            {isSubmitting && <LinearProgress />}
            <div className="marginTop15">
              <Button title={t("saveButton")} disabled={isSubmitting} handleClick={submitForm} />
            </div>
            <div className="marginTop15">
              <Button
                title={t("resetPasswordButton")}
                disabled={isSubmitting}
                variant={ButtonVariantEnum.TEXT}
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
