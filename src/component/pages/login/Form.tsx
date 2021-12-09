/* eslint-disable camelcase */
import React from "react";
import Button from "@/components/ui/Button";
import { LinearProgress, TextField } from "@material-ui/core";
import PasswordField from "@/components/statefull/PasswordField";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
// import TermsOfUse from "@/components/statefull/TermsOfUse";
import { toast } from "@/utils/notifications";
import { Formik, Form, Field, FieldProps } from "formik";
import Divider from "@/components/ui/Divider";
import { SelectVariantEnum, ButtonVariantEnum, ConfigFilesNCEnum } from "@/enums/index";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import * as Yup from "yup";
import { signIn, getSession } from "next-auth/client";
import { parseCookies, setCookie } from "nookies";
import { useDispatch } from "react-redux";
import { userUpdate } from "@/store/actions/users/index";
import { UserInfoInterface, MediaInfoInterface, UserProfileInterface } from "@/interfaces/index";
import Box from "@material-ui/core/Box";
import { listFile } from "@/services/webdav/files";

type MyFormValues = {
  email: string;
  password: string;
};

export default function WrapperForm() {
  // const [openTerms, setOpenTerms] = useState(true);
  const dispatch = useDispatch();
  const { t: c } = useTranslation("common");
  const { t } = useTranslation("login");
  const cookies = parseCookies();
  const router = useRouter();

  // const errorsAuth = new Map();
  // errorsAuth.set(ErrorAuthEnum.ERR001, t("loginInvalid"));
  // errorsAuth.set(ErrorAuthEnum.ERR002, t("permissionDenied"));
  // errorsAuth.set(ErrorAuthEnum.ERR003, t("userDeactivated"));

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

  const navigateToForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={(values: MyFormValues, { setSubmitting }: any) => {
          const { password, email } = values;
          setSubmitting(true);
          (async () => {
            const lang = cookies.NEXT_LOCALE || "en";
            const result: any | null = await signIn("credentials", {
              redirect: false,
              email,
              password,
              lang,
            });

            if (!result.error) {
              const session: any = await getSession();
              const { user }: { user: UserInfoInterface } = session;

              let mediaOrg;
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
                const mediaName = file.medias[0];

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
              } catch (e) {
                mediaOrg = {
                  name: "Radio Colmena",
                  logo: "",
                  slogan:
                    "Gulf Radio is a community radio based in kosele town, rachuonyo subcounty in homabay county in Kenya.",
                  email: "",
                  groups: ["devteam"],
                  quota: "10GB",
                  url: "htt://www.radiotal.org",
                };
              }

              user.media = mediaOrg;

              dispatch(
                userUpdate({
                  user,
                }),
              );
              const { language: locale } = user;
              setCookie(null, "NEXT_LOCALE", locale, {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
              });

              router.push("/home", "", {
                locale,
              });
              setSubmitting(false);
              return;
            }

            setSubmitting(false);
            toast(
              result.error === "permissionDenied" ? t("permissionDenied") : t("loginInvalid"),
              "error",
            );
          })();
        }}
      >
        {({ submitForm, isSubmitting, setFieldValue, errors, touched }: any) => (
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
            <Box
              flexDirection="row"
              display="flex"
              alignContent="center"
              justifyContent="space-between"
            >
              <Button
                title={c("form.forgetPasswordTitle")}
                style={{ fontSize: 12 }}
                variant={ButtonVariantEnum.TEXT}
                handleClick={navigateToForgotPassword}
              />
              <Button
                title={c("form.submitLoginTitle")}
                disabled={isSubmitting}
                handleClick={submitForm}
                style={{ width: "40%" }}
              />
            </Box>
            {/* <TermsOfUse open={openTerms} handleSetOpen={(flag) => setOpenTerms(flag)} /> */}
          </Form>
        )}
      </Formik>
    </>
  );
}
