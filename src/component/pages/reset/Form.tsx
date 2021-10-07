import React, { useState, useContext } from "react";
import Button from "@/components/ui/Button";
import { LinearProgress } from "@material-ui/core";
import PasswordField from "@/components/statefull/PasswordField";
// import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import TermsOfUse from "@/components/statefull/TermsOfUse";
import NotificationContext from "@/store/context/notification-context";
import { Formik, Form, Field, FieldProps } from "formik";
import Divider from "@/components/ui/Divider";
import { NotificationStatusEnum } from "@/enums/index";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import * as Yup from "yup";

type MyFormValues = {
  email: string;
  password: string;
};

export default function WrapperForm() {
  const [openTerms, setOpenTerms] = useState(false);
  const { t: c } = useTranslation("common");
  const { t } = useTranslation("reset");
  const notificationCtx = useContext(NotificationContext);
  // const router = useRouter();

  const ValidationSchema = Yup.object().shape({
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
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={(values: MyFormValues, { setSubmitting }: any) => {
          // const { password } = values;
          setSubmitting(true);
          (async () => {
            notificationCtx.showNotification({
              message: t("successMessage"),
              status: NotificationStatusEnum.SUCCESS,
            });
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
              title={c("form.submitSaveTitle")}
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
