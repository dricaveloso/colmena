import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@/components/ui/Button";
import { Formik, Form, Field, FieldProps } from "formik";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import Divider from "@/components/ui/Divider";
import * as Yup from "yup";
import { ButtonColorEnum, ButtonVariantEnum } from "@/enums/*";
import { useTranslation } from "next-i18next";
import { toast } from "@/utils/notifications";
import { useDispatch, useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { updateUser } from "@/services/ocs/users";
import { userInfoUpdate } from "@/store/actions/users";
import Backdrop from "@/components/ui/Backdrop";
import { signOut } from "next-auth/client";
import { useRouter } from "next/router";
import PasswordField from "@/components/statefull/PasswordField";
import Modal from "@/components/ui/Modal";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { margin: theme.spacing(0, 0, 4, 0) },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3),
    width: "90vw",
  },
  form: {
    "& .MuiTextField-root": {
      width: "100%",
    },
  },
  submit: {
    float: "right",
  },
}));

type Props = {
  open: boolean;
  handleClose: () => void;
};

type MyFormValues = {
  currentPassword: string;
  newPassword: string;
};

export default function ResetPasswordModal({ open, handleClose }: Props) {
  const { t: c } = useTranslation("common");
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const currentPasswordRdx = userRdx.user.password;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showBackdrop, setShowBackdrop] = useState(false);
  const router = useRouter();

  const initialValues = {
    currentPassword: "",
    newPassword: "",
  };

  const schemaValidation = Yup.object().shape({
    currentPassword: Yup.string()
      .min(6, c("form.passwordMinLengthTitle", { size: 6 }))
      .max(30, c("form.passwordMaxLengthTitle", { size: 30 }))
      .required(c("form.requiredTitle")),
    newPassword: Yup.string()
      .min(6, c("form.passwordMinLengthTitle", { size: 6 }))
      .max(30, c("form.passwordMaxLengthTitle", { size: 30 }))
      .required(c("form.requiredTitle")),
  });

  return (
    <>
      <Modal title={c("resetPasswordTitle")} handleClose={handleClose} open={open}>
        {showBackdrop && <Backdrop open={showBackdrop} />}
        <Formik
          initialValues={initialValues}
          validationSchema={schemaValidation}
          onSubmit={(values: MyFormValues, { setSubmitting }: any) => {
            const { currentPassword, newPassword } = values;
            (async () => {
              try {
                if (currentPassword !== currentPasswordRdx) {
                  throw new Error(c("form.currentPasswordInvalidTitle"));
                }
                setSubmitting(true);
                setShowBackdrop(true);

                const result = await updateUser<string | number>("password", newPassword);
                if (result.data.ocs.meta.statuscode !== 200) {
                  throw new Error(c("messages.unableToUpdatePassword"));
                }
                dispatch(userInfoUpdate({ password: newPassword }));

                setSubmitting(false);
                setShowBackdrop(false);

                handleClose();
                toast(c("messages.passwordUpdatedSuccessfully"), "success");
                await signOut({ redirect: false });
                router.push("/login");
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
          {({ submitForm, isSubmitting, errors, touched, setFieldValue }: any) => (
            <Form
              autoComplete="off"
              className={classes.form}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitForm();
                }
              }}
            >
              <Field
                name="currentPassword"
                data-testid="current-password-field"
                InputProps={{ notched: true }}
              >
                {({ field }: FieldProps) => (
                  <PasswordField
                    label={c("form.placeholderCurrentPassword")}
                    handleChangePassword={(value: string) => {
                      setFieldValue("currentPassword", value);
                    }}
                    placeholder=""
                    required
                    {...field}
                  />
                )}
              </Field>
              {errors.currentPassword && touched.currentPassword ? (
                <ErrorMessageForm message={errors.currentPassword} />
              ) : null}
              <Divider marginTop={20} />
              <Field
                name="newPassword"
                data-testid="new-password-field"
                InputProps={{ notched: true }}
              >
                {({ field }: FieldProps) => (
                  <PasswordField
                    label={c("form.placeholderNewPassword")}
                    handleChangePassword={(value: string) => {
                      setFieldValue("newPassword", value);
                    }}
                    placeholder=""
                    required
                    {...field}
                  />
                )}
              </Field>
              {errors.newPassword && touched.newPassword ? (
                <ErrorMessageForm message={errors.newPassword} />
              ) : null}
              <Divider marginTop={20} />
              <Button
                handleClick={submitForm}
                color={ButtonColorEnum.PRIMARY}
                variant={ButtonVariantEnum.CONTAINED}
                disabled={isSubmitting}
                style={{ float: "right" }}
                title={c("form.submitSaveTitle")}
                data-testid="submit-reset-password"
              />
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}
