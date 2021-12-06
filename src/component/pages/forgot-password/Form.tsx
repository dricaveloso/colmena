/* eslint-disable camelcase */
import React, { useContext, useState } from "react";
import Button from "@/components/ui/Button";
import { TextField } from "@material-ui/core";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import NotificationContext from "@/store/context/notification-context";
import { Formik, Form, Field, FieldProps } from "formik";
import Divider from "@/components/ui/Divider";
import { NotificationStatusEnum, SelectVariantEnum, ButtonVariantEnum } from "@/enums/index";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import * as Yup from "yup";
import Box from "@material-ui/core/Box";
import BackdropModal from "@/components/ui/Backdrop";

type MyFormValues = {
  email: string;
};

export default function WrapperForm() {
  const { t: c } = useTranslation("common");
  const [showBackdrop, setShowBackdrop] = useState(false);
  const notificationCtx = useContext(NotificationContext);
  const router = useRouter();

  const ValidationSchema = Yup.object().shape({
    email: Yup.string().email(c("form.invalidEmailTitle")).required(c("form.requiredTitle")),
  });

  const initialValues: MyFormValues = {
    email: "",
  };

  const navigateToLogin = () => {
    router.push("/login");
  };

  return (
    <>
      {showBackdrop && <BackdropModal open={showBackdrop} />}
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={(values: MyFormValues, { setSubmitting }: any) => {
          const { email } = values;
          setSubmitting(true);
          (async () => {
            setSubmitting(true);
            setShowBackdrop(true);
            try {
              const response = await fetch("/api/recover-password", {
                method: "POST",
                body: JSON.stringify({ email }),
                headers: {
                  "Content-type": "application/json",
                },
              });
              const data = await response.json();
              console.log(data);
              if (data.success) {
                notificationCtx.showNotification({
                  message: c("passwordRecoveryMessage"),
                  status: NotificationStatusEnum.SUCCESS,
                });
                router.push("/login");
              } else {
                notificationCtx.showNotification({
                  message: c("genericErrorMessage"),
                  status: NotificationStatusEnum.ERROR,
                });
              }
            } catch (e) {
              console.log(e);
              notificationCtx.showNotification({
                message: c("genericErrorMessage"),
                status: NotificationStatusEnum.ERROR,
              });
            } finally {
              setSubmitting(false);
              setShowBackdrop(false);
            }
          })();
        }}
      >
        {({ submitForm, isSubmitting, errors, touched }: any) => (
          <Form
            style={{ width: "100%" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitForm();
              }
            }}
          >
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
            <Box
              flexDirection="row"
              display="flex"
              alignContent="center"
              justifyContent="space-between"
            >
              <Button
                title={c("backToLogin")}
                style={{ fontSize: 12 }}
                variant={ButtonVariantEnum.TEXT}
                handleClick={navigateToLogin}
              />
              <Button
                title={c("form.recoverPasswordButton")}
                disabled={isSubmitting}
                handleClick={submitForm}
                style={{ width: "60%" }}
              />
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
}