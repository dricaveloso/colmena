/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
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
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {
  PropsAudioSave,
  SelectOptionItem,
  PropsUserSelector,
  PropsConfigSelector,
  PropsLibrarySelector,
} from "@/types/index";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { ButtonColorEnum, ButtonVariantEnum, TextVariantEnum, ButtonSizeEnum } from "@/enums/*";
import ChangeUploadLocationModal from "./ChangeUploadLocationModal";
import {
  convertPrivateToUsername,
  convertUsernameToPrivate,
  getPrivatePath,
} from "@/utils/directory";
import { useSelector } from "react-redux";
import { toast } from "@/utils/notifications";
import { SystemTagsInterface } from "@/interfaces/tags";
import { listTags } from "@/services/webdav/tags";

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
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const configRdx = useSelector((state: { config: PropsConfigSelector }) => state.config);
  const libraryRdx = useSelector((state: { library: PropsLibrarySelector }) => state.library);
  const { t } = useTranslation("recording");
  const [changeLocationModal, setChangeLocationModal] = useState(false);
  const [optionsTag, setOptionsTag] = useState<SelectOptionItem[]>([]);
  const [availableOffline, setAvailableOffline] = useState(true);
  const [uploadLocation, setUploadLocation] = useState("");
  const { t: c } = useTranslation("common");

  const chooseUploadLocationHandle = useCallback((path: string) => {
    setUploadLocation(path);
    setChangeLocationModal(false);
  }, []);

  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required(c("form.requiredTitle")),
    tags: Yup.array(Yup.string()).min(1, t("tagsRequiredTitle")),
  });

  const initialValues: MyFormValues = {
    name: "",
    tags: [],
  };

  useEffect(() => {
    setUploadLocation(prepareUploadPath());
    (async () => {
      try {
        const res = await listTags();
        const optionsTag: SelectOptionItem[] = res
          .filter((_, idx) => idx !== 0)
          .map((item: any | SystemTagsInterface) => ({
            id: item.propstat.prop.id,
            value: item.propstat.prop["display-name"].toLowerCase(),
          }));
        setOptionsTag(optionsTag);
      } catch (e) {
        console.log("erro ao consultar as tags", e);
      }
    })();
  }, []);

  function prepareUploadPath() {
    const urlOrigin = configRdx.lastTwoPagesAccessed[1];
    let url = "";

    if (/^[/]library/.test(urlOrigin)) {
      if ((urlOrigin.match(/[/]/g) || []).length > 1) {
        const path = libraryRdx.currentPath;
        url = convertPrivateToUsername(path, userRdx.user.id).replace(/[/]library[/]/, "");
      }
    }

    if (/^[/]honeycomb/.test(urlOrigin)) {
      const url_ = urlOrigin.split("/");
      if (urlOrigin.length > 2) {
        url = url_[url_.length - 1];
      }
    }

    return url || convertPrivateToUsername(getPrivatePath(), userRdx.user.id);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvailableOffline(event.target.checked);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={(values: MyFormValues) => {
          try {
            if (values.name.indexOf("/") !== -1) {
              throw new Error(
                c("form.slashNotAllowed", {
                  field: c("form.fields.name"),
                }),
              );
            }
            const tagsFiltered = values.tags.map((item: string) => item.toLocaleLowerCase());
            handleSubmit({
              ...values,
              tags: tagsFiltered,
              path: convertUsernameToPrivate(uploadLocation, userRdx.user.id),
              availableOffline,
            });
          } catch (e) {
            toast(e.message, "error");
          }
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
                      <Chip
                        variant="outlined"
                        label={option.toLocaleLowerCase()}
                        {...getTagProps({ index })}
                      />
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
                {errors.tags && touched.tags ? <ErrorMessageForm message={errors.tags} /> : null}
                <Box marginTop={1} marginBottom={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={availableOffline}
                        onChange={handleChange}
                        name="availableOffline"
                      />
                    }
                    label={
                      <Text variant={TextVariantEnum.BODY2}>
                        {t("availableWithoutInternetTitle")}
                      </Text>
                    }
                  />
                </Box>
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
