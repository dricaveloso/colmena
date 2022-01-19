import React from "react";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "next-i18next";
import IconButton from "@material-ui/core/IconButton";
import * as Yup from "yup";
import { Formik, Form, Field, FieldProps, ErrorMessage } from "formik";
import Divider from "@/components/ui/Divider";
import TextField from "@material-ui/core/TextField";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import Button from "@/components/ui/Button";
import { TagInterface } from "@/interfaces/index";
import { treatTagName } from "@/utils/utils";

const styles: any = (theme: any) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props: any) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

type Props = {
  tag?: TagInterface;
  handleClose: () => void;
  handleSubmit: (values: any) => void;
  isLoading: boolean;
};

export default function FormModal({ tag, handleClose, handleSubmit, isLoading }: Props) {
  const { t } = useTranslation("tags");
  const { t: c } = useTranslation("common");
  const initialValues = {
    name: tag?.tag ?? "",
  };

  const TagSchema = Yup.object().shape({
    name: Yup.string().required(c("form.requiredTitle")),
  });

  return (
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open>
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        {tag ? t("editTagTitle") : t("createTagTitle")}
      </DialogTitle>
      <DialogContent dividers>
        <Formik initialValues={initialValues} validationSchema={TagSchema} onSubmit={handleSubmit}>
          {({ setFieldValue }: any) => (
            <Form>
              <Field name="name" InputProps={{ notched: true }}>
                {({ field }: FieldProps) => (
                  <TextField
                    id="outlined-search"
                    label={t("form.fields.name")}
                    variant="outlined"
                    inputProps={{ maxLength: 60 }}
                    {...field}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                      setFieldValue("name", treatTagName(event.target.value))
                    }
                  />
                )}
              </Field>
              <ErrorMessage name="name">{(msg) => <ErrorMessageForm message={msg} />}</ErrorMessage>
              <Divider marginTop={20} />
              <Button
                title={t("saveButton")}
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
              />
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
