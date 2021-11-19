import React, { useContext } from "react";
import Button from "@/components/ui/Button";
import { LinearProgress, TextField } from "@material-ui/core";
import PasswordField from "@/components/statefull/PasswordField";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
// import TermsOfUse from "@/components/statefull/TermsOfUse";
import NotificationContext from "@/store/context/notification-context";
import { Formik, Form, Field, FieldProps } from "formik";
import Divider from "@/components/ui/Divider";
import { NotificationStatusEnum, SelectVariantEnum, ButtonVariantEnum } from "@/enums/index";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import * as Yup from "yup";
import { signIn, getSession } from "next-auth/client";
import { parseCookies, setCookie } from "nookies";
import { useDispatch } from "react-redux";
import { userUpdate } from "@/store/actions/users/index";
import { UserInfoInterface } from "@/interfaces/index";
import Box from "@material-ui/core/Box";

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
  const notificationCtx = useContext(NotificationContext);
  const router = useRouter();

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

            notificationCtx.showNotification({
              message:
                result.error === "permissionDenied" ? t("permissionDenied") : t("loginInvalid"),
              status: NotificationStatusEnum.ERROR,
            });
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
