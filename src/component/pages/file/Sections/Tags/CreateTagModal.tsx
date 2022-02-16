import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import TextField from "@material-ui/core/TextField";
import Divider from "@/components/ui/Divider";
import { useTranslation } from "next-i18next";
import { toast } from "@/utils/notifications";
import { Grid } from "@material-ui/core";
import { LibraryItemInterface } from "@/interfaces/index";
import { PropsUserSelector, SelectOptionItem } from "@/types/*";
import {
  assignTagFile,
  createAndAssignTagFile,
  getFileTags,
  ItemTagInterface,
  listTags,
} from "@/services/webdav/tags";
import { SystemTagsInterface } from "@/interfaces/tags";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { parseCookies } from "nookies";

type Props = {
  open: boolean;
  closeModal: () => void;
  data: LibraryItemInterface;
  setTags: React.Dispatch<React.SetStateAction<ItemTagInterface[]>>;
};

export default function CreateTagModal({ open, closeModal, data, setTags }: Props) {
  const cookies = parseCookies();
  const lang = cookies.NEXT_LOCALE || "en";
  const [optionsTag, setOptionsTag] = useState<SelectOptionItem[]>([]);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation("file");
  const { t: c } = useTranslation("common");
  const [tagOnBlur, setTagOnBlur] = useState("");
  const [autoFocusCustom, setAutoFocusCustom] = useState(false);
  const initialValues = {
    tags: [],
  };

  const separator = lang === "ar" ? "،" : ",";

  const createTag = async (values: any) => {
    const { tags } = values;

    if (tagOnBlur) tags.push(tagOnBlur);

    setIsLoading(true);

    try {
      const tagsFoundOnline = optionsTag
        .filter((item) => tags.includes(item.value))
        .map((item) => item.id);

      const tagsOnlineValues = optionsTag.map((item) => item.value);
      const tagsNotFoundOnline = tags.filter((item: string) => !tagsOnlineValues.includes(item));

      // eslint-disable-next-line no-restricted-syntax
      for (const item of tagsFoundOnline) {
        // eslint-disable-next-line no-await-in-loop
        await assignTagFile(Number(data.fileId), Number(item));
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const item of tagsNotFoundOnline) {
        // eslint-disable-next-line no-await-in-loop
        await createAndAssignTagFile(Number(data.fileId), item);
      }

      const ncTags = await getFileTags(userRdx.user.id, data.filename, data.fileId);
      if (ncTags) {
        setTags(ncTags);
      }

      toast(t("messages.tagsSuccessfullyCreated"));
      closeModal();
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await listTags();
        const optionsTag: SelectOptionItem[] = res
          .filter((_, idx) => idx !== 0)
          .map((item: any | SystemTagsInterface) => ({
            id: item.propstat.prop.id,
            value: String(item.propstat.prop["display-name"]).toLowerCase(),
          }));
        setOptionsTag(optionsTag);
      } catch (e) {
        console.log("erro ao consultar as tags", e);
      }
    })();

    return () => {
      setOptionsTag([]);
    };
  }, []);

  return (
    <Modal title={t("createTag")} handleClose={closeModal} open={open}>
      <Formik initialValues={initialValues} onSubmit={createTag}>
        {({ setFieldValue, values, errors, touched }: any) => (
          <Form>
            <>
              <Autocomplete
                key={uuid()}
                onBlur={(e: any) => setTagOnBlur(e.target.value)}
                multiple
                value={values.tags}
                data-testid="audio-tags"
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
                    autoFocus={autoFocusCustom}
                    margin="dense"
                    variant="outlined"
                    label={t("tagTitle")}
                  />
                )}
              />
              {errors.tags && touched.tags ? <ErrorMessageForm message={errors.tags} /> : null}
              <Divider marginTop={20} />
              <Grid container justifyContent="flex-end">
                <Button
                  title={c("form.submitSaveTitle")}
                  disabled={isLoading}
                  isLoading={isLoading}
                  type="submit"
                />
              </Grid>
            </>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
