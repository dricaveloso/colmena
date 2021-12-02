import React, { useEffect, useState } from "react";
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
import { PropsAudioSave, SelectOptionItem, PropsUserSelector } from "@/types/index";
import Chip from "@material-ui/core/Chip";
import { listTags } from "@/services/webdav/tags";
import { SystemTagsInterface } from "@/interfaces/tags";
import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { ButtonColorEnum, ButtonVariantEnum, TextVariantEnum, ButtonSizeEnum } from "@/enums/*";
import ChangeUploadLocationModal from "./ChangeUploadLocationModal";
import { convertPrivateToUsername } from "@/utils/directory";
import { useSelector } from "react-redux";

type Props = {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (values: PropsAudioSave) => void;
  chooseUploadLocationHandle: (path: string) => void;
  uploadLocation: string;
};

type MyFormValues = {
  name: string;
  tags: string[];
};

export default function DialogExtraInfoAudio({
  open,
  handleClose,
  handleSubmit,
  uploadLocation,
  chooseUploadLocationHandle,
}: Props) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const { t } = useTranslation("recording");
  const [optionsTag, setOptionsTag] = useState<SelectOptionItem[]>([]);
  const [changeLocationModal, setChangeLocationModal] = useState(false);
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
    <>
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
                      variant="outlined"
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
                    <TextField
                      {...params}
                      margin="dense"
                      variant="outlined"
                      label={t("tagsTitle")}
                    />
                  )}
                />
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  paddingLeft={1}
                  paddingTop={1}
                >
                  <Box display="flex" flexDirection="column">
                    <Text variant={TextVariantEnum.BODY1} style={{ fontWeight: "bold" }}>
                      {t("uploadLocationTitle")}
                    </Text>
                    <Text variant={TextVariantEnum.BODY2}>
                      {`/${convertPrivateToUsername(uploadLocation, userRdx.user.id)}`}
                    </Text>
                  </Box>
                  <Button
                    handleClick={() => setChangeLocationModal(true)}
                    style={{ margin: 8 }}
                    variant={ButtonVariantEnum.TEXT}
                    color={ButtonColorEnum.PRIMARY}
                    title={t("changeUploadLocationTitle")}
                    size={ButtonSizeEnum.SMALL}
                  />
                </Box>
              </Form>
            </DialogContent>
            <DialogActions>
              <Button
                handleClick={submitForm}
                style={{ margin: 8 }}
                variant={ButtonVariantEnum.CONTAINED}
                color={ButtonColorEnum.PRIMARY}
                title={t("submitButton")}
              />
            </DialogActions>
          </Dialog>
        )}
      </Formik>
      {changeLocationModal && (
        <ChangeUploadLocationModal
          title={t("uploadLocationTitle")}
          open={changeLocationModal}
          handleClose={() => setChangeLocationModal(false)}
          handleClick={(path: string) => chooseUploadLocationHandle(path)}
        />
      )}
    </>
  );
}
