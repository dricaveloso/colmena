/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable camelcase */
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { TextField, Box } from "@material-ui/core";
import Select from "@/components/ui/Select";
import { useTranslation } from "next-i18next";
import { toast } from "@/utils/notifications";
import {
  SelectVariantEnum,
  RoleUserEnum,
  ConfigFilesNCEnum,
  ButtonVariantEnum,
  ButtonColorEnum,
} from "@/enums/index";
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
import Divider from "@/components/ui/Divider";
import Modal from "@/components/ui/Modal";
import { findTokenChatByPath } from "@/pages/recording";

const { publicRuntimeConfig } = getConfig();

type Props = {
  open: boolean;
  handleClose: () => void;
};

type MyFormValues = {
  name: string;
  emailCol: string;
  group: string;
  permission: string;
};

export default function InviteForm({ open, handleClose }: Props) {
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
    <Modal
      title={t("textInviteCollaborators")}
      description={t("descriptionModalDialogInvite")}
      handleClose={handleClose}
      open={open}
    >
      <div>
        <Backdrop open={showBackdrop} />
        <Formik
          initialValues={initialValues}
          validationSchema={ValidationSchema}
          onSubmit={(values: MyFormValues, { setSubmitting }: any) => {
            setShowBackdrop(true);
            setSubmitting(false);
            // const { name, emailCol: email, group, permission } = values;
          }}
        >
          {({ submitForm, isSubmitting, errors, touched }: any) => (
            <>
              <Form autoComplete="off">
                <Field name="name" data-testid="media-name" InputProps={{ notched: true }}>
                  {({ field }: FieldProps) => (
                    <TextField
                      id="name"
                      variant="outlined"
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
                <Divider marginTop={20} />
                <Field name="emailCol" data-testid="media-email" InputProps={{ notched: true }}>
                  {({ field }: FieldProps) => (
                    <TextField
                      variant="outlined"
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
                <Divider marginTop={20} />
                <Field name="group" data-testid="media-group" InputProps={{ notched: true }}>
                  {({ field }: FieldProps) => (
                    <Select
                      label={t("placeholderGroup")}
                      variant={SelectVariantEnum.OUTLINED}
                      options={userRdx.user.subadmin.map((item) => ({
                        id: item,
                        value: item,
                      }))}
                      id="group"
                      {...field}
                    />
                  )}
                </Field>
                {errors.group && touched.group ? <ErrorMessageForm message={errors.group} /> : null}
                <Divider marginTop={20} />
                <Field
                  name="permission"
                  data-testid="media-permission"
                  InputProps={{ notched: true }}
                >
                  {({ field }: FieldProps) => (
                    <Select
                      label={t("placeholderPermission")}
                      variant={SelectVariantEnum.OUTLINED}
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
              <Box
                display="flex"
                marginTop={2}
                flex={1}
                flexDirection="row"
                justifyContent="space-between"
              >
                <Button
                  handleClick={handleClose}
                  title={t("buttonCancelModalDialogInvite")}
                  data-testid="close-modal-invite"
                  color={ButtonColorEnum.SECONDARY}
                  variant={ButtonVariantEnum.OUTLINED}
                />
                <Button
                  handleClick={submitForm}
                  title={t("buttonOkModalDialogInvite")}
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  data-testid="submit-invite"
                  type="submit"
                />
              </Box>
            </>
          )}
        </Formik>
      </div>
    </Modal>
  );
}
