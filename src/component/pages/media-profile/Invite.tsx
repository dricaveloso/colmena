/* eslint-disable max-len */
/* eslint-disable camelcase */
import React, { useState } from "react";
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
import { toast } from "@/utils/notifications";
import { SelectVariantEnum, RoleUserEnum, ConfigFilesNCEnum } from "@/enums/index";
import { Formik, Form, Field, FieldProps } from "formik";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import * as Yup from "yup";
import { createUser } from "@/services/ocs/users";
import { putFile, listFile } from "@/services/webdav/files";
import Backdrop from "@/components/ui/Backdrop";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import getConfig from "next/config";
import { UserProfileInterface } from "@/interfaces/index";

const { publicRuntimeConfig } = getConfig();

type Props = {
  openInviteForm: boolean;
  handleCloseInviteForm: () => void;
};

type MyFormValues = {
  name: string;
  emailCol: string;
  group: string;
  permission: string;
};

export default function InviteForm({ openInviteForm, handleCloseInviteForm }: Props) {
  const { t } = useTranslation("mediaProfile");
  const { t: c } = useTranslation("common");
  const [showBackdrop, setShowBackdrop] = useState(false);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required(c("form.requiredTitle")),
    emailCol: Yup.string().email(c("form.invalidEmailTitle")).required(c("form.requiredTitle")),
    group: Yup.string().required(c("form.requiredTitle")),
    permission: Yup.string().required(c("form.requiredTitle")),
  });

  const initialValues: MyFormValues = {
    name: "",
    emailCol: "",
    group: "",
    permission: "",
  };

  async function createOrUpdateFile(userId: string, file: UserProfileInterface) {
    await putFile(userId, ConfigFilesNCEnum.USER_PROFILE, JSON.stringify(file), {
      username: userId,
      password: publicRuntimeConfig.user.defaultNewUserPassword,
    });
  }

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
            const { name, emailCol: email, group, permission } = values;

            (async () => {
              try {
                const user = await createUser(name, email, group, permission);
                const userId = user.data.ocs.data.id;
                let file: UserProfileInterface;
                try {
                  const userProfileFile = await listFile(
                    userId,
                    ConfigFilesNCEnum.USER_PROFILE,
                    {
                      username: userId,
                      password: publicRuntimeConfig.user.defaultNewUserPassword,
                    },
                    true,
                  );
                  file = JSON.parse(String(userProfileFile));
                  file.medias.push(group);
                  await createOrUpdateFile(userId, file);
                } catch (e) {
                  console.log("Arquivo .profile.json não encontrado", e);
                }

                handleCloseInviteForm();
                toast(t("messageOkModalDialogInvite"), "success");
              } catch (e) {
                console.log(e);

                handleCloseInviteForm();
                toast(t("messageErrorModalDialogInvite"), "warning");
              } finally {
                setShowBackdrop(false);
              }
            })();
          }}
        >
          {({ submitForm, isSubmitting, errors, touched }: any) => (
            <>
              <DialogContent>
                <DialogContentText>{t("descriptionModalDialogInvite")}</DialogContentText>
                <Form autoComplete="off">
                  <Field name="name" InputProps={{ notched: true }}>
                    {({ field }: FieldProps) => (
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        inputProps={{
                          autoComplete: "off",
                          form: {
                            autoComplete: "off",
                          },
                        }}
                        label={t("placeholderName")}
                        type="text"
                        fullWidth
                        {...field}
                      />
                    )}
                  </Field>
                  {errors.name && touched.name ? <ErrorMessageForm message={errors.name} /> : null}
                  <Field name="emailCol" InputProps={{ notched: true }}>
                    {({ field }: FieldProps) => (
                      <TextField
                        margin="dense"
                        inputProps={{
                          autoComplete: "off",
                          form: {
                            autoComplete: "off",
                          },
                        }}
                        id="emailCol"
                        label={t("placeholderEmail")}
                        type="email"
                        fullWidth
                        {...field}
                      />
                    )}
                  </Field>
                  {errors.emailCol && touched.emailCol ? (
                    <ErrorMessageForm message={errors.emailCol} />
                  ) : null}
                  <Field name="group" InputProps={{ notched: true }}>
                    {({ field }: FieldProps) => (
                      <Select
                        label={t("placeholderGroup")}
                        variant={SelectVariantEnum.STANDARD}
                        options={userRdx.user.subadmin.map((item) => ({
                          id: item,
                          value: item,
                        }))}
                        id="group"
                        {...field}
                      />
                    )}
                  </Field>
                  {errors.group && touched.group ? (
                    <ErrorMessageForm message={errors.group} />
                  ) : null}
                  <Field name="permission" InputProps={{ notched: true }}>
                    {({ field }: FieldProps) => (
                      <Select
                        label={t("placeholderPermission")}
                        variant={SelectVariantEnum.STANDARD}
                        options={[
                          {
                            id: RoleUserEnum.COLLABORATOR,
                            value: t("inviteCollaboratorTitle"),
                            disabled: true,
                          },
                          {
                            id: RoleUserEnum.ADMIN,
                            value: t("inviteAdministratorTitle"),
                          },
                        ]}
                        id="permission"
                        {...field}
                      />
                    )}
                  </Field>
                  {errors.permission && touched.permission ? (
                    <ErrorMessageForm message={errors.permission} />
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
