import React, { useEffect, useState } from "react";
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
import { PropsAudioSave, SelectOptionItem } from "@/types/index";
import Chip from "@material-ui/core/Chip";
import { listTags } from "@/services/webdav/tags";
import { SystemTagsInterface } from "@/interfaces/tags";

type Props = {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (values: PropsAudioSave) => void;
};

type MyFormValues = {
  name: string;
  tags: string[];
};

export default function DialogExtraInfoAudio({ open, handleClose, handleSubmit }: Props) {
  const { t } = useTranslation("recording");
  const [optionsTag, setOptionsTag] = useState<SelectOptionItem[]>([]);
  const { t: c } = useTranslation("common");

  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required(c("form.requiredTitle")),
  });

  const initialValues: MyFormValues = {
    name: "",
    tags: [],
  };

  useEffect(() => {
    (async () => {
      const res = await listTags();
      const tags: SelectOptionItem[] = res
        .filter((_, idx) => idx !== 0)
        .map((item: any | SystemTagsInterface) => ({
          id: item.propstat.prop.id,
          value: item.propstat.prop["display-name"],
        }));
      setOptionsTag(tags);
    })();
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ValidationSchema}
      onSubmit={(values: MyFormValues) => {
        // if (values.tags.length === 0) {
        //   setRequiredTag(c("form.requiredTitle"));
        //   return;
        // }
        // setRequiredTag("");
        handleSubmit(values);
      }}
    >
      {({ submitForm, errors, touched, setFieldValue, values }: any) => (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{t("recordingFinishTitle")}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t("recordingFinishDescription")}</DialogContentText>
            <Form>
              <Field name="name" InputProps={{ notched: true }}>
                {({ field }: FieldProps) => (
                  <TextField
                    autoFocus
                    margin="dense"
                    autoComplete="new-name"
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
                value={values.tags}
                id="tags-filled"
                options={optionsTag.map((option) => option.value)}
                defaultValue={["asd"]}
                onChange={(e, value) => setFieldValue("tags", value)}
                freeSolo
                renderTags={(value: string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} variant="standard" label={t("tagsTitle")} />
                )}
              />
              {/* {requiredTag !== "" ? <ErrorMessageForm message={requiredTag} /> : null} */}
            </Form>
          </DialogContent>
          <DialogActions>
            {/* <Button onClick={handleClose} color="primary">
              {t("cancelButton")}
            </Button> */}
            <Button onClick={submitForm} style={{ margin: 8 }} variant="contained" color="primary">
              {t("submitButton")}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
}
