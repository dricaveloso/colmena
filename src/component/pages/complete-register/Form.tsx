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
import { UserInvitationInterface } from "@/interfaces/index";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import { v4 as uuid } from "uuid";
// import axios from "axios";
import * as Yup from "yup";

type MyFormValues = {
  password: string;
  passwordConfirmation: string;
};

type Props = {
  userInfo?: UserInvitationInterface | undefined;
};

export default function WrapperForm({ userInfo }: Props) {
  const [openTerms, setOpenTerms] = useState(false);
  const [accept, setAccept] = useState(false);
  const { t } = useTranslation("completeRegister");
  const { t: c } = useTranslation("common");
  const notificationCtx = useContext(NotificationContext);
  const router = useRouter();

  console.log(userInfo);

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
            // const response = await axios.post(
            //   "https://690c09a3db8d3670017555507.mockapi.io/api/v1/RESET_PASSWORD",
            // );
            router.push("/login");
          } catch (e) {
            notificationCtx.showNotification({
              message: "Intern Error",
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
