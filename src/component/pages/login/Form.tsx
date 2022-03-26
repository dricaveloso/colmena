/* eslint-disable camelcase */
import React from "react";
import Button from "@/components/ui/Button";
import {
  // LinearProgress,
  InputAdornment,
  OutlinedInput,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PasswordField from "@/components/statefull/PasswordField";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { toast } from "@/utils/notifications";
import { Formik, Form, Field, FieldProps } from "formik";
import Divider from "@/components/ui/Divider";
import { ButtonVariantEnum, ConfigFilesNCEnum } from "@/enums/index";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import * as Yup from "yup";
import { signIn, getSession } from "next-auth/client";
import { parseCookies, setCookie } from "nookies";
import { useDispatch } from "react-redux";
import { userUpdate } from "@/store/actions/users/index";
import { UserInfoInterface, MediaInfoInterface, UserProfileInterface } from "@/interfaces/index";
import Box from "@material-ui/core/Box";
import { listFile } from "@/services/webdav/files";
import { v4 as uuid } from "uuid";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@/components/ui/Backdrop";
import { trailingSlash } from "@/utils/utils";

type MyFormValues = {
  emlLogin: string;
  psdLogin: string;
};

// const useStyles = makeStyles(() =>
//   createStyles({
//     cssLabel: {
//       color: "white !important",
//     },

//     cssOutlinedInput: {
//       "&$cssFocused $notchedOutline": {
//         borderColor: `white !important`,
//       },
//     },

//     cssFocused: {},

//     notchedOutline: {
//       borderWidth: 1,
//       borderColor: "white !important",
//     },
//   }),
// );

export default function WrapperForm() {
  const dispatch = useDispatch();
  const { t: c } = useTranslation("common");
  const { t } = useTranslation("login");
  const cookies = parseCookies();
  const router = useRouter();
  const { redirect } = router.query;

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

  function trimEmail(value: string, originalValue: string) {
    return originalValue.trim();
  }

  const ValidationSchema = Yup.object().shape({
    emlLogin: Yup.string()
      .transform(trimEmail)
      .email(c("form.invalidEmailTitle"))
      .required(c("form.requiredTitle")),
    psdLogin: Yup.string()
      .min(6, c("form.passwordMinLengthTitle", { size: 6 }))
      .max(30, c("form.passwordMaxLengthTitle", { size: 30 }))
      .required(c("form.requiredTitle")),
  });

  const initialValues: MyFormValues = {
    emlLogin: "",
    psdLogin: "",
  };

  const navigateToForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={(values: MyFormValues, { setSubmitting }: any) => {
          const { psdLogin: password, emlLogin: emailv } = values;
          const email = emailv.trim();
          setSubmitting(true);
          (async () => {
            const langCookie = cookies.NEXT_LOCALE || "en";
            const result: any | null = await signIn("credentials", {
              redirect: false,
              email,
              password,
            });

            if (!result.error) {
              const session: any = await getSession();
              const { user }: { user: UserInfoInterface } = session;

              let mediaOrg;
              let mediaName = "";
              try {
                const userProfileFile = await listFile(
                  user.id,
                  ConfigFilesNCEnum.USER_PROFILE,
                  {
                    username: user.id,
                    password: user.password,
                  },
                  true,
                );
                const file: UserProfileInterface = JSON.parse(String(userProfileFile));
                // eslint-disable-next-line prefer-destructuring
                mediaName = file.medias[0];
              } catch (e) {
                console.log(e.message);
                toast(t("profileNotFound"), "error");
                setSubmitting(false);
                return;
              }

              try {
                const mediaFile = await listFile(
                  user.id,
                  `${mediaName}/${ConfigFilesNCEnum.MEDIA_PROFILE}`,
                  {
                    username: user.id,
                    password: user.password,
                  },
                  true,
                );
                const mediaObj: MediaInfoInterface = JSON.parse(String(mediaFile));
                mediaOrg = mediaObj;
                user.media = mediaOrg;
              } catch (e) {
                console.log(e.message);
                toast(t("mediaNotFound"), "error");
                setSubmitting(false);
                return;
              }

              const { language } = user;
              if (language !== langCookie) {
                user.language = language;
              }

              dispatch(
                userUpdate({
                  user,
                }),
              );

              setCookie(null, "NEXT_LOCALE", user.language, {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
              });
              if (!redirect) {
                router.push("/home", "", {
                  locale: user.language,
                });
              } else {
                router.push(trailingSlash(redirect.toString()), "", {
                  locale: user.language,
                });
              }

              setSubmitting(false);
              return;
            }

            setSubmitting(false);
            toast(
              result.error === "permissionDenied" ? t("permissionDenied") : t("loginInvalid"),
              "warning",
            );
          })();
        }}
      >
        {({ submitForm, isSubmitting, setFieldValue, errors, touched }: any) => (
          <>
            <Backdrop open={isSubmitting} />
            <Form
              id="loginForm"
              autoComplete="off"
              style={{ width: "100%" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitForm();
                }
              }}
            >
              <Field
                name="emlLogin"
                InputProps={{
                  notched: true,
                }}
              >
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
              {errors.emlLogin && touched.emlLogin ? (
                <ErrorMessageForm message={errors.emlLogin} color="#fff" />
              ) : null}
              <Divider marginTop={20} />
              <Field name="psdLogin" InputProps={{ notched: true }}>
                {({ field }: FieldProps) => (
                  <PasswordField
                    mainColor="#fff"
                    label={c("form.placeholderPassword")}
                    placeholder={c("form.placeholderPassword")}
                    handleChangePassword={(value: string) => {
                      setFieldValue("psdLogin", value);
                    }}
                    required
                    {...field}
                  />
                )}
              </Field>
              {errors.psdLogin && touched.psdLogin ? (
                <ErrorMessageForm message={errors.psdLogin} color="#fff" />
              ) : null}
              <Divider marginTop={20} />
              {/* {isSubmitting && <LinearProgress />} */}
              <Divider marginTop={20} />
              <Box
                flexDirection="column"
                display="flex"
                alignContent="center"
                alignItems="center"
                justifyContent="center"
                flex={1}
              >
                <Button
                  title={c("form.forgetPasswordTitle")}
                  style={{ color: "#fff" }}
                  variant={ButtonVariantEnum.TEXT}
                  handleClick={navigateToForgotPassword}
                />
                <Button
                  title={c("form.submitLoginTitle")}
                  disabled={isSubmitting}
                  handleClick={submitForm}
                  style={{
                    width: 200,
                    marginTop: 15,
                    marginBottom: 30,
                    textTransform: "uppercase",
                  }}
                />
              </Box>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
