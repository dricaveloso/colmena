/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import TextField from "@material-ui/core/TextField";
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
  PropsLibrarySelector,
} from "@/types/index";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import {
  ButtonColorEnum,
  ButtonVariantEnum,
  TextVariantEnum,
  ButtonSizeEnum,
  TextAlignEnum,
} from "@/enums/*";
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
import Modal from "@/components/ui/Modal";
import ButtonCore from "@material-ui/core/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { getAccessedPages } from "@/utils/utils";
import { parseCookies } from "nookies";
import { v4 as uuid } from "uuid";
import { makeStyles, Theme } from "@material-ui/core/styles";

type Props = {
  open: boolean;
  handleClose: (event: any, reason: string) => void;
  handleSubmit: (values: PropsAudioSave) => void;
  pathLocationSave: string;
  discardAudioHandle: () => void;
  tempFileName: string;
};

type MyFormValues = {
  name: string;
  tags: string[];
};

const useStyles = makeStyles((theme: Theme) => ({
  tagInformation: {
    color: theme.palette.gray.main,
  },
  advancedOptionsTitle: {
    fontSize: 12,
    textTransform: "capitalize",
  },
  locationAudio: {
    fontWeight: "bold",
  },
  marginButton: {
    marginTop: 8,
  },
}));

export default function DialogExtraInfoAudio({
  open,
  handleSubmit,
  pathLocationSave = "",
  discardAudioHandle,
  tempFileName,
}: Props) {
  const classes = useStyles();
  const cookies = parseCookies();
  const lang = cookies.NEXT_LOCALE || "en";
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const libraryRdx = useSelector((state: { library: PropsLibrarySelector }) => state.library);
  const { t } = useTranslation("recording");
  const [changeLocationModal, setChangeLocationModal] = useState(false);
  const [optionsTag, setOptionsTag] = useState<SelectOptionItem[]>([]);
  const [availableOffline, setAvailableOffline] = useState(true);
  const [uploadLocation, setUploadLocation] = useState(pathLocationSave);
  const { t: c } = useTranslation("common");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [autoFocusCustom, setAutoFocusCustom] = useState(false);
  const [tagOnBlur, setTagOnBlur] = useState("");

  const chooseUploadLocationHandle = useCallback((path: string) => {
    setUploadLocation(path);
    setChangeLocationModal(false);
  }, []);

  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required(c("form.requiredTitle")),
    // tags: Yup.array(Yup.string()).min(1, t("tagsRequiredTitle")),
  });

  const initialValues: MyFormValues = {
    name: tempFileName,
    tags: [],
  };

  const init = async () => {
    const pathUp = await prepareUploadPath();
    setUploadLocation(pathUp);
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
  };

  useEffect(() => {
    init();

    return () => {
      setOptionsTag([]);
      setUploadLocation("");
    };
  }, []);

  async function prepareUploadPath() {
    if (pathLocationSave) return pathLocationSave;

    const accessedPages = await getAccessedPages();
    const urlOrigin = accessedPages[1] || accessedPages[0];
    let url = "";

    if (/^[/]library/.test(urlOrigin)) {
      if ((urlOrigin.match(/[/]/g) || []).length > 1) {
        const path = libraryRdx.currentPath;
        url = convertPrivateToUsername(path, userRdx.user.id).replace(/[/]library[/]/, "");
      }
    }

    if (/^[/]honeycomb/.test(urlOrigin)) {
      const url_ = urlOrigin.split("/");
      if (url_.length > 4) {
        url = decodeURI(url_[url_.length - 2]);
      }
    }

    return url || convertPrivateToUsername(getPrivatePath(), userRdx.user.id);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvailableOffline(event.target.checked);
  };

  const separator = lang === "ar" ? "،" : ",";

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
            const tagArray = values.tags;

            if (tagOnBlur) tagArray.push(tagOnBlur);

            const tagsFiltered = tagArray
              .map((item: string) => item.replaceAll(separator, "").toLocaleLowerCase())
              .filter((item: string) => item !== "");

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
          <Modal
            title={t("recordingFinishTitle")}
            open={open}
            aria-labelledby="form-dialog-title"
            actions={
              <Box display="flex" flex="1" flexDirection="row" justifyContent="space-between">
                <Button
                  handleClick={discardAudioHandle}
                  className={classes.marginButton}
                  variant={ButtonVariantEnum.OUTLINED}
                  color={ButtonColorEnum.SECONDARY}
                  title={t("discardButton")}
                  data-testid="discard-audio"
                />
                <Button
                  handleClick={submitForm}
                  variant={ButtonVariantEnum.CONTAINED}
                  className={classes.marginButton}
                  title={t("submitButton")}
                  data-testid="save-audio"
                />
              </Box>
            }
          >
            <Form>
              <Field name="name" data-testid="audio-name" InputProps={{ notched: true }}>
                {({ field }: FieldProps) => (
                  <TextField
                    margin="dense"
                    variant="outlined"
                    onFocus={() => setAutoFocusCustom(false)}
                    autoComplete="off"
                    id="name"
                    label={t("recordingFinishLabelForm")}
                    inputProps={{ maxLength: 60 }}
                    fullWidth
                    {...field}
                  />
                )}
              </Field>
              {errors.name && touched.name ? <ErrorMessageForm message={errors.name} /> : null}

              <Box display="flex" flex={1} justifyContent="flex-start">
                <ButtonCore
                  size="small"
                  data-testid="advanced-options-button"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  startIcon={showAdvancedOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  <Text variant={TextVariantEnum.CAPTION} className={classes.advancedOptionsTitle}>
                    {t("advancedOptionsTitle")}
                  </Text>
                </ButtonCore>
              </Box>
              {showAdvancedOptions && (
                <>
                  <Autocomplete
                    key={uuid()}
                    onBlur={(e: any) => setTagOnBlur(e.target.value)}
                    data-testid="audio-tags"
                    multiple
                    value={values.tags}
                    id="tags-filled"
                    options={optionsTag.map((option) => option.value)}
                    defaultValue={["asd"]}
                    onChange={(e, value) => {
                      setAutoFocusCustom(true);
                      setFieldValue("tags", value);
                    }}
                    onInputChange={(event, value) => {
                      const arr = values.tags;
                      if (value.split("").every((item) => item.indexOf(separator) !== -1)) return;

                      if (value.indexOf(separator) !== -1) {
                        const res = value.split(",")[0];
                        if (res) {
                          arr.push(res.replace(separator, ""));
                          setFieldValue("tags", arr);
                          setAutoFocusCustom(true);
                        }
                      }
                    }}
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
                        autoFocus={autoFocusCustom}
                        label={t("tagsTitle")}
                      />
                    )}
                  />
                  <Box width="100%">
                    <Text
                      className={classes.tagInformation}
                      align={TextAlignEnum.LEFT}
                      variant={TextVariantEnum.CAPTION}
                    >
                      {t("tagInformationTitle")}
                    </Text>
                  </Box>
                  <Box marginTop={1} marginBottom={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={availableOffline}
                          onChange={handleChange}
                          name="availableOffline"
                          data-testid="switch-available-offline"
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
                      <Text variant={TextVariantEnum.BODY1} className={classes.locationAudio}>
                        {t("uploadLocationTitle")}
                      </Text>
                      <Text variant={TextVariantEnum.BODY2}>
                        {`/${convertPrivateToUsername(uploadLocation, userRdx.user.id)}`}
                      </Text>
                    </Box>
                    <Button
                      handleClick={() => setChangeLocationModal(true)}
                      className={classes.marginButton}
                      variant={ButtonVariantEnum.TEXT}
                      color={ButtonColorEnum.PRIMARY}
                      title={t("changeUploadLocationTitle")}
                      size={ButtonSizeEnum.SMALL}
                      data-testid="change-location-audio"
                    />
                  </Box>
                </>
              )}
            </Form>
          </Modal>
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
