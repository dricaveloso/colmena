import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Button from "@/components/ui/Button";
import { Formik, Form, Field, FieldProps } from "formik";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import Divider from "@/components/ui/Divider";
import * as Yup from "yup";
import { NotificationStatusEnum, ButtonColorEnum, ButtonVariantEnum } from "@/enums/*";
import { useTranslation } from "next-i18next";
import NotificationContext from "@/store/context/notification-context";
import { useDispatch, useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { updatePassword } from "@/services/ocs/users";
import { userUpdatePassword } from "@/store/actions/users";
import BackdropModal from "@/components/ui/Backdrop";
import { signOut } from "next-auth/client";
import { useRouter } from "next/router";

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
  const userId = userRdx.user.id;
  const currentPasswordRdx = userRdx.user.password;
  const classes = useStyles();
  const dispatch = useDispatch();
  const notificationCtx = useContext(NotificationContext);
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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h4 id="transition-modal-title" className={classes.title}>
              {c("resetPasswordTitle")}
            </h4>
            <BackdropModal open={showBackdrop} />
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

                    const result = await updatePassword(userId, newPassword, currentPassword);
                    if (result.data.ocs.meta.statuscode !== 200) {
                      throw new Error(c("messages.unableToUpdatePassword"));
                    }
                    dispatch(userUpdatePassword(newPassword));

                    setSubmitting(false);
                    setShowBackdrop(false);

                    handleClose();
                    notificationCtx.showNotification({
                      message: c("messages.passwordUpdatedSuccessfully"),
                      status: NotificationStatusEnum.SUCCESS,
                    });
                    await signOut({ redirect: false });
                    router.push("/login");
                  } catch (e) {
                    console.log(e);
                    const msg = e.message ? e.message : c("messages.unableToUpdatePassword");
                    notificationCtx.showNotification({
                      message: msg,
                      status: NotificationStatusEnum.ERROR,
                    });
                  } finally {
                    setShowBackdrop(false);
                    setSubmitting(false);
                  }
                })();
              }}
            >
              {({ submitForm, isSubmitting, errors, touched }: any) => (
                <Form
                  className={classes.form}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      submitForm();
                    }
                  }}
                >
                  <Field name="currentPassword" InputProps={{ notched: true }}>
                    {({ field }: FieldProps) => (
                      <TextField
                        id="outlined-search"
                        label={c("form.placeholderCurrentPassword")}
                        variant="outlined"
                        type="password"
                        {...field}
                      />
                    )}
                  </Field>
                  {errors.currentPassword && touched.currentPassword ? (
                    <ErrorMessageForm message={errors.currentPassword} />
                  ) : null}
                  <Divider marginTop={20} />
                  <Field name="newPassword" InputProps={{ notched: true }}>
                    {({ field }: FieldProps) => (
                      <TextField
                        id="outlined-search"
                        type="password"
                        label={c("form.placeholderNewPassword")}
                        variant="outlined"
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
                  />
                </Form>
              )}
            </Formik>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
