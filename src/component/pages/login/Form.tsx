import React, { useState, useContext } from "react";
import Button from "@/components/ui/Button";
import { LinearProgress, TextField } from "@material-ui/core";
import PasswordField from "@/components/statefull/PasswordField";
// import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import TermsOfUse from "@/components/statefull/TermsOfUse";
import NotificationContext from "@/store/notification-context";
import { Formik, Form, Field, FieldProps } from "formik";
import Divider from "@/components/ui/Divider";
import { NotificationStatusEnum, SelectVariantEnum } from "@/enums/index";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import axios from "axios";
import * as Yup from "yup";

type MyFormValues = {
  email: string;
  password: string;
};

export default function WrapperForm() {
  const [openTerms, setOpenTerms] = useState(false);
  const { t: c } = useTranslation("common");
  const notificationCtx = useContext(NotificationContext);
  // const router = useRouter();

  const ValidationSchema = Yup.object().shape({
    email: Yup.string().email(c("form.invalidEmailTitle")).required(c("form.requiredTitle")),
    password: Yup.string()
      .min(6, c("form.passwordMinLengthTitle", { size: 6 }))
      .max(30, c("form.passwordMaxLengthTitle", { size: 30 }))
      .required(c("form.requiredTitle")),
  });

  const initialValues: MyFormValues = {
    email: "",
    password: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ValidationSchema}
      onSubmit={(values: MyFormValues, { setSubmitting }: any) => {
        const { password, email } = values;
        setSubmitting(true);
        (async () => {
          try {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
              {
                username: email,
                password,
              },
            );
            // const response = await axios.post(
            //   `https://60c09a3db8d3670017555507.mockapi.io/api/v1/login`,
            //   {
            //     username: email,
            //     password,
            //   },
            // );
            console.log(response);
            // router.push("/login");
          } catch (e) {
            notificationCtx.showNotification({
              message: c("messages.loginFailedTitle"),
              status: NotificationStatusEnum.ERROR,
            });
          } finally {
            setSubmitting(false);
          }
        })();
      }}
    >
      {({ submitForm, isSubmitting, setFieldValue, errors, touched }: any) => (
        <Form>
          <Field name="email" InputProps={{ notched: true }}>
            {({ field }: FieldProps) => (
              <TextField
                id="email"
                label={c("form.placeholderEmail")}
                variant={SelectVariantEnum.OUTLINED}
                fullWidth
                {...field}
              />
            )}
          </Field>
          {errors.email && touched.email ? <ErrorMessageForm message={errors.email} /> : null}
          <Divider marginTop={20} />
          <Field name="password" InputProps={{ notched: true }}>
            {({ field }: FieldProps) => (
              <PasswordField
                label={c("form.placeholderPassword")}
                placeholder={c("form.placeholderPassword")}
                handleChangePassword={(value: string) => {
                  setFieldValue("password", value);
                }}
                required
                {...field}
              />
            )}
          </Field>
          {errors.password && touched.password ? (
            <ErrorMessageForm message={errors.password} />
          ) : null}
          <Divider marginTop={20} />
          {isSubmitting && <LinearProgress />}
          <Divider marginTop={20} />
          <Button
            title={c("form.submitLoginTitle")}
            disabled={isSubmitting}
            handleClick={submitForm}
          />
          <TermsOfUse open={openTerms} handleSetOpen={(flag) => setOpenTerms(flag)} />
        </Form>
      )}
    </Formik>
  );
}
