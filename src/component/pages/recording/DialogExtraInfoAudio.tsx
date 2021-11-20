import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useTranslation } from "next-i18next";
import * as Yup from "yup";
import { Formik, Form, Field, FieldProps } from "formik";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { NXTagsProps, PropsAudioSave } from "@/types/index";

type Props = {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (values: PropsAudioSave) => void;
};

type MyFormValues = {
  name: string;
  tags: NXTagsProps[];
};

const nextcloudTags: NXTagsProps[] = [
  { id: 1, title: "Category 1" },
  { id: 2, title: "Category 2" },
  { id: 3, title: "Category 3" },
];

export default function DialogExtraInfoAudio({ open, handleClose, handleSubmit }: Props) {
  const { t } = useTranslation("recording");
  const [requiredTag, setRequiredTag] = useState("");
  const { t: c } = useTranslation("common");

  const NXTagsSchema = Yup.object().shape({
    id: Yup.number().required(),
    title: Yup.string().required(),
  });

  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required(c("form.requiredTitle")),
    tags: Yup.array().of(NXTagsSchema).required(c("form.requiredTitle")),
  });

  const initialValues: MyFormValues = {
    name: "",
    tags: [],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ValidationSchema}
      onSubmit={(values: MyFormValues) => {
        if (values.tags.length === 0) {
          setRequiredTag(c("form.requiredTitle"));
          return;
        }
        setRequiredTag("");
        handleSubmit(values);
      }}
    >
      {({ submitForm, errors, touched, setFieldValue }: any) => (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{t("recordingFinishTitle")}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t("recordingFinishDescription")}</DialogContentText>
            <Form>
              <Field name="name" InputProps={{ notched: true }}>
                {({ field }: FieldProps) => (
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label={t("recordingFinishLabelForm")}
                    inputProps={{ maxLength: 60 }}
                    fullWidth
                    {...field}
                  />
                )}
              </Field>
              {errors.name && touched.name ? <ErrorMessageForm message={errors.name} /> : null}
              <Autocomplete
                multiple
                onChange={(e, value) => setFieldValue("tags", value)}
                id="tags"
                options={nextcloudTags}
                getOptionLabel={(option: NXTagsProps) => option.title}
                renderInput={(params) => <TextField {...params} variant="standard" label="Tags" />}
              />
              {requiredTag !== "" ? <ErrorMessageForm message={requiredTag} /> : null}
            </Form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {t("cancelButton")}
            </Button>
            <Button onClick={submitForm} color="primary">
              {t("submitButton")}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
}
