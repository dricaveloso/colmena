import React, { useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@/components/ui/Modal";
import TextField from "@material-ui/core/TextField";
import Button from "@/components/ui/Button";
import { PropsUserSelector } from "@/types/index";
import { useSelector } from "react-redux";
import { Formik, Form, Field, FieldProps, ErrorMessage } from "formik";
import Divider from "@/components/ui/Divider";
import * as Yup from "yup";
import { removeFirstSlash } from "@/utils/utils";
import { toast } from "@/utils/notifications";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import { useTranslation } from "next-i18next";
import router from "next/router";
import { Box } from "@material-ui/core";
import { ButtonVariantEnum, ButtonColorEnum } from "@/enums/*";
import ActionConfirm from "../../ActionConfirm";
import { putFile } from "@/services/webdav/files";

const useStyles = makeStyles(() => ({
  form: {
    "& .MuiTextField-root": {
      width: "100%",
    },
  },
  submit: {
    marginLeft: 10,
  },
}));

type Props = {
  open: boolean;
  handleClose: () => void;
};

// let requestCancel = false;

interface IForm {
  filename: string;
}

export default function NewEditorModal({ open, handleClose }: Props) {
  const { t } = useTranslation("common");
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const userId = userRdx.user.id;
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [cancelIsLoading, setCancelIsLoading] = useState(false);
  const initialValues = {
    filename: "",
  };

  const createFileText = async (values: IForm) => {
    const timer = 5000;

    const { filename } = values;
    const finalFilename = `private/${filename}.md`;
    setIsLoading(true);

    try {
      await putFile(userId, finalFilename, "", {
        username: userRdx.user.id,
        password: userRdx.user.password,
      });
      setShowConfirmCancel(false);

      toast(t("messages.fileCreatedSuccessfully"), "success", { timer });
      router.push(`/text-editor/${removeFirstSlash(filename)}`);
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const NewFolderSchema = Yup.object().shape({
    filename: Yup.string().required(t("form.requiredTitle")),
  });

  const confirmClose = useCallback(() => {
    if (isLoading) {
      setShowConfirmCancel(true);
    } else {
      handleClose();
    }
  }, [handleClose, isLoading]);

  const requestAbortUpload = () => {
    setCancelIsLoading(true);
    // requestCancel = true;
    toast(t("messages.folderCreationCanceledSuccessfully"), "success");
    handleClose();
  };

  return (
    <>
      <Modal
        data-testid="modal-new-folder"
        title={t("newFileTitle")}
        open={open}
        handleClose={isLoading ? undefined : handleClose}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={NewFolderSchema}
          onSubmit={(values) => createFileText(values)}
        >
          {({ setFieldValue, submitForm }: any) => (
            <Form
              className={classes.form}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitForm();
                }
              }}
            >
              <Field name="filename" InputProps={{ notched: true }}>
                {({ field }: FieldProps) => (
                  <TextField
                    id="outlined-search"
                    inputProps={{
                      maxLength: 60,
                      autoComplete: "off",
                      form: {
                        autoComplete: "off",
                      },
                    }}
                    label={t("form.fields.name")}
                    variant="outlined"
                    {...field}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                      setFieldValue("filename", event.target.value)
                    }
                  />
                )}
              </Field>
              <ErrorMessage name="filename">
                {(msg) => <ErrorMessageForm message={msg} />}
              </ErrorMessage>
              <Divider marginTop={20} />
              <Divider marginTop={20} />
              <Box display="flex" justifyContent="flex-end" width="100%">
                {isLoading && (
                  <Button
                    handleClick={confirmClose}
                    title={t("form.cancelButton")}
                    data-cy="cancel"
                    color={ButtonColorEnum.DEFAULT}
                    variant={ButtonVariantEnum.OUTLINED}
                  />
                )}
                <Button
                  data-cy="submit"
                  title={t("form.create")}
                  type="submit"
                  className={classes.submit}
                  disabled={isLoading}
                  isLoading={isLoading}
                />
              </Box>
            </Form>
          )}
        </Formik>
      </Modal>
      {showConfirmCancel && (
        <ActionConfirm
          title={t("confirmCancelFolderCreation")}
          onOk={requestAbortUpload}
          onClose={() => setShowConfirmCancel(false)}
          isLoading={cancelIsLoading}
        />
      )}
    </>
  );
}
