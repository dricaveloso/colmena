/* eslint-disable camelcase */
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Button from "@/components/ui/Button";
import { toast } from "@/utils/notifications";
import { ButtonVariantEnum, SelectVariantEnum } from "@/enums/index";
import { makeStyles } from "@material-ui/styles";
import { Formik, Form, Field, FieldProps } from "formik";
import Divider from "@/components/ui/Divider";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import { useSelector, useDispatch } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import ResetPasswordModal from "./ResetPasswordModal";
import { updateUser } from "@/services/ocs/users";
import { userInfoUpdate } from "@/store/actions/users";
import BackdropModal from "@/components/ui/Backdrop";

type MyFormValues = {
  user_name: string;
  emlUser: string;
  lastname: string;
};

const useStyles = makeStyles({
  marginInputDivs: {
    "& > div": {
      marginBottom: 15,
    },
  },
});

export default function FormProfile() {
  const { t } = useTranslation("profile");
  const { t: c } = useTranslation("common");
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);

  const ValidationSchema = Yup.object().shape({
    user_name: Yup.string().required(c("form.requiredTitle")),
    emlUser: Yup.string().email(c("form.invalidEmailTitle")).required(c("form.requiredTitle")),
    lastname: Yup.string().required(c("form.requiredTitle")),
  });

  const initialValues: MyFormValues = {
    user_name: userRdx.user.name.split(" ")[0],
    emlUser: userRdx.user.email,
    lastname: userRdx.user.name
      .split(" ")
      .filter((_, idx) => idx !== 0)
      .join(" "),
  };

  const handleOpenResetPasswordModal = () => {
    setOpenResetPasswordModal(true);
  };

  const handleCloseResetPasswordModal = () => {
    setOpenResetPasswordModal(false);
  };

  return (
    <>
      {showBackdrop && <BackdropModal open={showBackdrop} />}
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={(values: MyFormValues, { setSubmitting }: any) => {
          const { user_name, lastname, emlUser: email } = values;
          const fullnameRdx = userRdx.user.name;
          const emailRdx = userRdx.user.email;
          const fullname = `${user_name} ${lastname}`;
          setShowBackdrop(true);
          (async () => {
            try {
              let updated = false;
              if (fullname !== fullnameRdx) {
                await updateUser<string>("displayname", fullname);
                updated = true;
              }
              if (emailRdx !== email) {
                await updateUser<string>("email", email);
                updated = true;
              }
              if (updated) {
                toast(c("form.successMessageFormSave"), "success");
                dispatch(userInfoUpdate({ name: fullname, email }));
              } else {
                toast(c("form.dataAlreadyUpdated"), "warning");
              }
            } catch (e) {
              console.log(e);
              const msg = e.message ? e.message : c("messages.unableToUpdatePassword");
              toast(msg, "error");
            } finally {
              setShowBackdrop(false);
              setSubmitting(false);
            }
          })();
        }}
      >
        {({ submitForm, isSubmitting, errors, touched }: any) => (
          <Form autoComplete="off">
            <Field name="user_name" InputProps={{ notched: true }}>
              {({ field }: FieldProps) => (
                <TextField
                  id="user_name"
                  inputProps={{
                    autocomplete: "off",
                    form: {
                      autocomplete: "off",
                    },
                  }}
                  label={t("nameField")}
                  variant={SelectVariantEnum.OUTLINED}
                  required
                  fullWidth
                  {...field}
                />
              )}
            </Field>
            {errors.user_name && touched.user_name ? (
              <ErrorMessageForm message={errors.user_name} />
            ) : null}
            <Divider marginTop={20} />
            <Field name="lastname" InputProps={{ notched: true }}>
              {({ field }: FieldProps) => (
                <TextField
                  id="lastname"
                  inputProps={{
                    autocomplete: "off",
                    form: {
                      autocomplete: "off",
                    },
                  }}
                  label={t("lastnameField")}
                  variant={SelectVariantEnum.OUTLINED}
                  required
                  fullWidth
                  {...field}
                />
              )}
            </Field>
            {errors.lastname && touched.lastname ? (
              <ErrorMessageForm message={errors.lastname} />
            ) : null}
            <Divider marginTop={20} />
            <Field name="emlUser" InputProps={{ notched: true }}>
              {({ field }: FieldProps) => (
                <TextField
                  id="emlUser"
                  type="email"
                  label={t("emailField")}
                  variant={SelectVariantEnum.OUTLINED}
                  required
                  inputProps={{
                    autocomplete: "off",
                    form: {
                      autocomplete: "off",
                    },
                  }}
                  fullWidth
                  {...field}
                />
              )}
            </Field>
            {errors.emlUser && touched.emlUser ? (
              <ErrorMessageForm message={errors.emlUser} />
            ) : null}
            <Divider marginTop={20} />
            <div className={classes.marginInputDivs}>
              <div className="marginTop15">
                <Button title={t("saveButton")} disabled={isSubmitting} handleClick={submitForm} />
              </div>
              <div className="marginTop15">
                <Button
                  title={t("resetPasswordButton")}
                  disabled={isSubmitting}
                  variant={ButtonVariantEnum.TEXT}
                  handleClick={handleOpenResetPasswordModal}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
      {openResetPasswordModal && (
        <ResetPasswordModal
          open={openResetPasswordModal}
          handleClose={handleCloseResetPasswordModal}
        />
      )}
    </>
  );
}
