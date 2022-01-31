/* eslint-disable camelcase */
import React from "react";
import Button from "@/components/ui/Button";
import { InputAdornment, OutlinedInput, FormControl, InputLabel } from "@material-ui/core";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Formik, Form, Field, FieldProps } from "formik";
import Divider from "@/components/ui/Divider";
import { ButtonVariantEnum } from "@/enums/index";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import * as Yup from "yup";
import Box from "@material-ui/core/Box";
import BackdropModal from "@/components/ui/Backdrop";
import { toast } from "@/utils/notifications";
import { v4 as uuid } from "uuid";
import { makeStyles } from "@material-ui/core/styles";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import theme from "@/styles/theme";

type MyFormValues = {
  email: string;
};

export default function WrapperForm() {
  const { t: c } = useTranslation("common");
  const router = useRouter();

  const color = `white !important`;
  const useOutlinedInputStyles = makeStyles(() => ({
    input: {
      color,
    },
    focused: {
      borderColor: color,
    },
    notchedOutline: {
      borderColor: color,
    },
  }));
  const outlinedInputClasses = useOutlinedInputStyles();

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
    <Formik
      initialValues={initialValues}
      validationSchema={ValidationSchema}
      onSubmit={(values: MyFormValues, { setSubmitting }: any) => {
        const { email } = values;
        setSubmitting(true);
        (async () => {
          setSubmitting(true);
          try {
            const response = await fetch("/api/recover-password", {
              method: "POST",
              body: JSON.stringify({ email }),
              headers: {
                "Content-type": "application/json",
              },
            });
            const data = await response.json();
            if (data.success) {
              toast(c("passwordRecoveryMessage"), "success");
              router.push("/login");
            } else {
              toast(c("genericErrorMessage"), "error");
            }
          } catch (e) {
            console.log(e);
            toast(c("genericErrorMessage"), "error");
          } finally {
            setSubmitting(false);
          }
        })();
      }}
    >
      {({ submitForm, isSubmitting, errors, touched }: any) => (
        <>
          <BackdropModal open={isSubmitting} />
          <Form
            id="loginForm"
            style={{ width: "100%" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitForm();
              }
            }}
          >
            <Field name="email" InputProps={{ notched: true }}>
              {({ field }: FieldProps) => (
                <FormControl style={{ width: "100%" }} variant="outlined">
                  <InputLabel htmlFor={`outlined-adornment-${c("form.placeholderEmail")}`}>
                    {c("form.placeholderEmail")}
                  </InputLabel>
                  <OutlinedInput
                    id={uuid()}
                    label={c("form.placeholderEmail")}
                    classes={outlinedInputClasses}
                    inputProps={{
                      autoComplete: "off",
                    }}
                    fullWidth
                    endAdornment={
                      <InputAdornment position="end">
                        <MailOutlineIcon style={{ color: "#fff" }} />
                      </InputAdornment>
                    }
                    {...field}
                  />
                </FormControl>
              )}
            </Field>
            {errors.email && touched.email ? (
              <ErrorMessageForm message={errors.email} color="#fff" />
            ) : null}
            <Divider marginTop={20} />
            <Box
              flexDirection="column"
              display="flex"
              alignContent="center"
              alignItems="center"
              justifyContent="center"
            >
              <Button
                title={c("backToLogin")}
                style={{ color: "#fff" }}
                variant={ButtonVariantEnum.TEXT}
                handleClick={navigateToLogin}
              />

              <Button
                title={c("form.recoverPasswordButton")}
                disabled={isSubmitting}
                handleClick={submitForm}
                style={{
                  width: 200,
                  marginTop: 15,
                  marginBottom: 30,
                  backgroundColor: theme.palette.variation1.main,
                  textTransform: "uppercase",
                }}
              />
            </Box>
          </Form>
        </>
      )}
    </Formik>
  );
}
