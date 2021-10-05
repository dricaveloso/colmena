import React, { useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import Select from "@/components/ui/Select";
import { useTranslation } from "next-i18next";
import NotificationContext from "@/store/context/notification-context";
import { NotificationStatusEnum, SelectVariantEnum } from "@/enums/index";
import { Formik, Form, Field, FieldProps } from "formik";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import * as Yup from "yup";
import { createUser, welcomeUser } from "@/services/ocs/users";
import Backdrop from "@/components/ui/Backdrop";

type Props = {
  openInviteForm: boolean;
  handleCloseInviteForm: () => void;
};

type MyFormValues = {
  name: string;
  email: string;
  group: string;
};

export default function InviteForm({ openInviteForm, handleCloseInviteForm }: Props) {
  const { t } = useTranslation("mediaProfile");
  const { t: c } = useTranslation("common");
  const notificationCtx = useContext(NotificationContext);
  const [showBackdrop, setShowBackdrop] = useState(false);

  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required(c("form.requiredTitle")),
    email: Yup.string().email(c("form.invalidEmailTitle")).required(c("form.requiredTitle")),
    group: Yup.string().required(c("form.requiredTitle")),
  });

  const initialValues: MyFormValues = {
    name: "",
    email: "",
    group: "",
  };

  const selectData = [
    {
      id: "colmena",
      value: t("inviteCollaboratorTitle"),
    },
    {
      id: "admin",
      value: t("inviteAdministratorTitle"),
    },
  ];

  return (
    <div>
      <Dialog
        open={openInviteForm}
        onClose={handleCloseInviteForm}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{t("textInviteCollaborators")}</DialogTitle>
        <Backdrop open={showBackdrop} />
        <Formik
          initialValues={initialValues}
          validationSchema={ValidationSchema}
          onSubmit={(values: MyFormValues, { setSubmitting }: any) => {
            setShowBackdrop(true);
            setSubmitting(false);
            const { name, email, group } = values;

            (async () => {
              try {
                const groups = [];
                groups.push(group);
                const result = await createUser(name, email, groups);

                if (result.data.ocs.meta.statuscode !== 200) {
                  throw new Error(t("createdErrorUser"));
                }

                console.log("uma vez");
                const userId = result.data.ocs.data.id;
                const result2 = await welcomeUser(userId);

                if (result2.data.ocs.meta.statuscode !== 200)
                  throw new Error(t("welcomeErrorUser"));

                setShowBackdrop(false);
                handleCloseInviteForm();
                notificationCtx.showNotification({
                  message: t("messageOkModalDialogInvite"),
                  status: NotificationStatusEnum.SUCCESS,
                });
              } catch (e) {
                const message = e.message ? e.message : t("messageErrorModalDialogInvite");

                setShowBackdrop(false);
                handleCloseInviteForm();
                notificationCtx.showNotification({
                  message,
                  status: NotificationStatusEnum.WARNING,
                });
              }
            })();
          }}
        >
          {({ submitForm, isSubmitting, errors, touched }: any) => (
            <>
              <DialogContent>
                <DialogContentText>{t("descriptionModalDialogInvite")}</DialogContentText>
                <Form>
                  <Field name="name" InputProps={{ notched: true }}>
                    {({ field }: FieldProps) => (
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label={t("placeholderName")}
                        type="text"
                        fullWidth
                        {...field}
                      />
                    )}
                  </Field>
                  {errors.name && touched.name ? <ErrorMessageForm message={errors.name} /> : null}
                  <Field name="email" InputProps={{ notched: true }}>
                    {({ field }: FieldProps) => (
                      <TextField
                        margin="dense"
                        id="email"
                        label={t("placeholderEmail")}
                        type="email"
                        fullWidth
                        {...field}
                      />
                    )}
                  </Field>
                  {errors.email && touched.email ? (
                    <ErrorMessageForm message={errors.email} />
                  ) : null}
                  <Field name="group" InputProps={{ notched: true }}>
                    {({ field }: FieldProps) => (
                      <Select
                        label={t("placeholderPermission")}
                        variant={SelectVariantEnum.STANDARD}
                        options={selectData}
                        id="group"
                        {...field}
                      />
                    )}
                  </Field>
                  {errors.group && touched.group ? (
                    <ErrorMessageForm message={errors.group} />
                  ) : null}
                </Form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseInviteForm} color="primary">
                  {t("buttonCancelModalDialogInvite")}
                </Button>
                <Button disabled={isSubmitting} onClick={submitForm} color="primary">
                  {t("buttonOkModalDialogInvite")}
                </Button>
              </DialogActions>
            </>
          )}
        </Formik>
      </Dialog>
    </div>
  );
}
