/* eslint-disable camelcase */
import React, { useState, useContext } from "react";
import Button from "@/components/ui/Button";
import { LinearProgress } from "@material-ui/core";
import PasswordField from "@/components/statefull/PasswordField";
import { useTranslation } from "next-i18next";
import TermsOfUse from "@/components/statefull/TermsOfUse";
import NotificationContext from "@/store/context/notification-context";
import { Formik, Form, Field, FieldProps } from "formik";
import Divider from "@/components/ui/Divider";
import { NotificationStatusEnum } from "@/enums/index";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import { updatePassword } from "@/services/ocs/users";
import { useRouter } from "next/router";
import * as Yup from "yup";

type MyFormValues = {
  password: string;
  password_confirmation: string;
};

type Props = {
  userId: string;
};

export default function WrapperForm({ userId }: Props) {
  const [openTerms, setOpenTerms] = useState(false);
  const { t: c } = useTranslation("common");
  const { t } = useTranslation("reset");
  const router = useRouter();
  const notificationCtx = useContext(NotificationContext);

  const ValidationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, c("form.passwordMinLengthTitle", { size: 6 }))
      .max(30, c("form.passwordMaxLengthTitle", { size: 30 }))
      .required(c("form.requiredTitle")),
    password_confirmation: Yup.string()
      .min(6, c("form.passwordMinLengthTitle", { size: 6 }))
      .max(30, c("form.passwordMaxLengthTitle", { size: 30 }))
      .required(c("form.requiredTitle")),
  });

  const initialValues: MyFormValues = {
    password_confirmation: "",
    password: "",
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={(values: MyFormValues, { setSubmitting }: any) => {
          setSubmitting(true);

          const { password, password_confirmation } = values;
          if (password !== password_confirmation) {
            notificationCtx.showNotification({
              message: t("errorMessagePassword"),
              status: NotificationStatusEnum.ERROR,
            });
            setSubmitting(false);
            return;
          }

          (async () => {
            try {
              const result = await updatePassword(atob(userId), password);
              if (result.data.ocs.meta.statuscode !== 200)
                throw new Error(t("errorUpdatingPassword"));

              notificationCtx.showNotification({
                message: t("successUpdatingPassword"),
                status: NotificationStatusEnum.SUCCESS,
              });
              router.replace("/login");
            } catch (e) {
              console.log(e);
              notificationCtx.showNotification({
                message: e.message,
                status: NotificationStatusEnum.ERROR,
              });
            } finally {
              setSubmitting(false);
            }
          })();
        }}
      >
        {({ submitForm, isSubmitting, setFieldValue, errors, touched }: any) => (
          <Form
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitForm();
              }
            }}
          >
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
            <Field name="password_confirmation" InputProps={{ notched: true }}>
              {({ field }: FieldProps) => (
                <PasswordField
                  label={c("form.placeholderPasswordConfirmation")}
                  placeholder={c("form.placeholderPasswordConfirmation")}
                  handleChangePassword={(value: string) => {
                    setFieldValue("password_confirmation", value);
                  }}
                  required
                  {...field}
                />
              )}
            </Field>
            {errors.password_confirmation && touched.password_confirmation ? (
              <ErrorMessageForm message={errors.password_confirmation} />
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
    </>
  );
}
