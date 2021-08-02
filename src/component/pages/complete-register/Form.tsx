import React, { useState, useContext } from "react";
import Button from "@/components/ui/Button";
import { Checkbox, LinearProgress } from "@material-ui/core";
import PasswordField from "@/components/statefull/PasswordField";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import TermsOfUse from "@/components/statefull/TermsOfUse";
import NotificationContext from "@/store/context/notification-context";
import { Formik, Form, Field, FieldProps } from "formik";
import Divider from "@/components/ui/Divider";
import { NotificationStatusEnum } from "@/enums/index";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import { v4 as uuid } from "uuid";
import axios from "axios";
import * as Yup from "yup";

type MyFormValues = {
  password: string;
  passwordConfirmation: string;
};

type Props = {
  invitationToken: string | undefined;
};

export default function WrapperForm({ invitationToken }: Props) {
  const [openTerms, setOpenTerms] = useState(false);
  const [accept, setAccept] = useState(false);
  const { t } = useTranslation("completeRegister");
  const { t: c } = useTranslation("common");
  const notificationCtx = useContext(NotificationContext);
  const router = useRouter();

  const SignupSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, c("form.passwordMinLengthTitle", { size: 6 }))
      .max(30, c("form.passwordMaxLengthTitle", { size: 30 }))
      .required(c("form.requiredTitle")),
    passwordConfirmation: Yup.string()
      .min(6, c("form.passwordMinLengthTitle", { size: 6 }))
      .max(30, c("form.passwordMaxLengthTitle", { size: 30 }))
      .required(c("form.requiredTitle")),
  });

  const handleChange = (event: any) => {
    setAccept(event.target.checked);
  };

  const initialValues: MyFormValues = {
    password: "",
    passwordConfirmation: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignupSchema}
      onSubmit={(values: MyFormValues, { setSubmitting }: any) => {
        const { password, passwordConfirmation } = values;
        setSubmitting(true);
        if (password !== passwordConfirmation) {
          notificationCtx.showNotification({
            message: c("form.differentPasswordsTitle"),
            status: NotificationStatusEnum.WARNING,
          });
          setSubmitting(false);
          return;
        }
        (async () => {
          try {
            const response = await axios.patch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/reset`,
              {
                tokenpass: invitationToken,
                password,
              },
            );

            if (response.data.response.errorMessage) {
              notificationCtx.showNotification({
                message: t("invalidToken"),
                status: NotificationStatusEnum.ERROR,
              });
              router.push("/");
              return;
            }

            notificationCtx.showNotification({
              message: t("messagePasswordCreated"),
              status: NotificationStatusEnum.SUCCESS,
            });

            router.push("/login");
          } catch (e) {
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
        <Form>
          <Field name="password" InputProps={{ notched: true }}>
            {({ field }: FieldProps) => (
              <PasswordField
                label={t("forms.placeholderPassword")}
                placeholder={t("forms.placeholderPassword")}
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
          <Field id={uuid()} name="passwordConfirmation" InputProps={{ notched: true }}>
            {({ field }: FieldProps) => (
              <PasswordField
                label={t("forms.placeholderPasswordConfirmation")}
                placeholder={t("forms.placeholderPasswordConfirmation")}
                handleChangePassword={(value: string) => {
                  setFieldValue("passwordConfirmation", value);
                }}
                required
                {...field}
              />
            )}
          </Field>
          {errors.passwordConfirmation && touched.passwordConfirmation ? (
            <ErrorMessageForm message={errors.passwordConfirmation} />
          ) : null}
          <Divider marginTop={20} />
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Checkbox
                onChange={handleChange}
                inputProps={{ "aria-label": "uncontrolled-checkbox" }}
              />
              <p>
                {c("agreeWithTerms")} {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  style={{ color: "tomato", cursor: "pointer" }}
                  onClick={() => setOpenTerms(true)}
                >
                  {c("termsOfUse")}
                </a>
              </p>
            </div>
            {isSubmitting && <LinearProgress />}
            <Divider marginTop={20} />
            <Button
              title={t("forms.submitButton")}
              disabled={!accept || isSubmitting}
              handleClick={submitForm}
            />
          </div>
          <TermsOfUse open={openTerms} handleSetOpen={(flag) => setOpenTerms(flag)} />
        </Form>
      )}
    </Formik>
  );
}
