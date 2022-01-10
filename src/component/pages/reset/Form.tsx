/* eslint-disable camelcase */
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { LinearProgress } from "@material-ui/core";
import PasswordField from "@/components/statefull/PasswordField";
import { useTranslation } from "next-i18next";
import TermsOfUse from "@/components/statefull/TermsOfUse";
import { toast } from "@/utils/notifications";
import { Formik, Form, Field, FieldProps } from "formik";
import Divider from "@/components/ui/Divider";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import { useRouter } from "next/router";
import Box from "@material-ui/core/Box";
import * as Yup from "yup";

type MyFormValues = {
  psdUserReset: string;
  psdUserResetConfirmation: string;
};

type Props = {
  userId: string;
};

export default function WrapperForm({ userId }: Props) {
  const [openTerms, setOpenTerms] = useState(false);
  const { t: c } = useTranslation("common");
  const { t } = useTranslation("reset");
  const router = useRouter();

  const ValidationSchema = Yup.object().shape({
    psdUserReset: Yup.string()
      .min(6, c("form.passwordMinLengthTitle", { size: 6 }))
      .max(30, c("form.passwordMaxLengthTitle", { size: 30 }))
      .required(c("form.requiredTitle")),
    psdUserResetConfirmation: Yup.string()
      .min(6, c("form.passwordMinLengthTitle", { size: 6 }))
      .max(30, c("form.passwordMaxLengthTitle", { size: 30 }))
      .required(c("form.requiredTitle")),
  });

  const initialValues: MyFormValues = {
    psdUserResetConfirmation: "",
    psdUserReset: "",
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={(values: MyFormValues, { setSubmitting }: any) => {
          const { psdUserReset: password, psdUserResetConfirmation: password_confirmation } =
            values;

          (async () => {
            try {
              setSubmitting(true);
              if (password !== password_confirmation) throw new Error(t("errorMessagePassword"));

              const response = await fetch("/api/update-user-password", {
                method: "PUT",
                body: JSON.stringify({ password, userId: atob(userId) }),
                headers: {
                  "Content-type": "application/json",
                },
              });
              const result = await response.json();

              if (!result.success) throw new Error(t("errorUpdatingPassword"));
              toast(t("successUpdatingPassword"), "success");
              router.replace("/login");
            } catch (e) {
              console.log(e);
              toast(e.message, "error");
            } finally {
              setSubmitting(false);
            }
          })();
        }}
      >
        {({ submitForm, isSubmitting, setFieldValue, errors, touched }: any) => (
          <Form
            autoComplete="off"
            style={{ width: "100%" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitForm();
              }
            }}
          >
            <Field name="psdUserReset" InputProps={{ notched: true }}>
              {({ field }: FieldProps) => (
                <PasswordField
                  label={c("form.placeholderPassword")}
                  placeholder={c("form.placeholderPassword")}
                  handleChangePassword={(value: string) => {
                    setFieldValue("psdUserReset", value);
                  }}
                  required
                  {...field}
                />
              )}
            </Field>
            {errors.psdUserReset && touched.psdUserReset ? (
              <ErrorMessageForm message={errors.psdUserReset} />
            ) : null}
            <Divider marginTop={20} />
            <Field name="psdUserResetConfirmation" InputProps={{ notched: true }}>
              {({ field }: FieldProps) => (
                <PasswordField
                  label={c("form.placeholderPasswordConfirmation")}
                  placeholder={c("form.placeholderPasswordConfirmation")}
                  handleChangePassword={(value: string) => {
                    setFieldValue("psdUserResetConfirmation", value);
                  }}
                  required
                  {...field}
                />
              )}
            </Field>
            {errors.psdUserResetConfirmation && touched.psdUserResetConfirmation ? (
              <ErrorMessageForm message={errors.psdUserResetConfirmation} />
            ) : null}
            <Divider marginTop={20} />
            {isSubmitting && <LinearProgress />}
            <Divider marginTop={20} />
            <Box display="flex" justifyContent="flex-end" flex="1">
              <Button
                title={c("form.submitLoginTitle")}
                disabled={isSubmitting}
                handleClick={submitForm}
                style={{ width: "50%" }}
              />
            </Box>
            <TermsOfUse open={openTerms} handleSetOpen={(flag) => setOpenTerms(flag)} />
          </Form>
        )}
      </Formik>
    </>
  );
}
