import React, { useState } from "react";
import { Formik, Form, Field, FieldProps } from "formik";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { setDataFile } from "@/services/webdav/files";
import TextField from "@material-ui/core/TextField";
import Divider from "@/components/ui/Divider";
import { useTranslation } from "next-i18next";
import { parseCookies } from "nookies";
import { toast } from "@/utils/notifications";
import { Grid } from "@material-ui/core";
import { LibraryItemInterface } from "@/interfaces/index";

interface IForm {
  title: string;
}

type Props = {
  open: boolean;
  closeModal: () => void;
  data: LibraryItemInterface;
  setData: React.Dispatch<React.SetStateAction<LibraryItemInterface>>;
};

export default function EditTitleModal({ open, closeModal, data, setData }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation("file");
  const { t: c } = useTranslation("common");
  const cookies = parseCookies();
  const language = cookies.NEXT_LOCALE || "en";
  const initialValues = {
    title: data.title || "",
  };

  const editTitle = async (values: IForm) => {
    const { title } = values;
    setIsLoading(true);

    try {
      await setDataFile({ customtitle: title, language }, `${data.filename}`);
      setData({ ...data, title });
      toast(t("messages.titleSuccessfullyUpdated"), "success");
      closeModal();
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title={t("editTitle")} handleClose={closeModal} open={open}>
      <Formik initialValues={initialValues} onSubmit={(values) => editTitle(values)}>
        {({ setFieldValue }: any) => (
          <Form>
            <Field name="title" InputProps={{ notched: true }}>
              {({ field }: FieldProps) => (
                <TextField
                  id="title"
                  label={t("title")}
                  variant="outlined"
                  inputProps={{ maxLength: 60 }}
                  style={{
                    width: "100%",
                  }}
                  {...field}
                  value={field.value ? decodeURI(field.value) : ""}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                    setFieldValue("title", event.target.value)
                  }
                />
              )}
            </Field>
            <Divider marginTop={20} />
            <Grid container justifyContent="flex-end">
              <Button
                title={c("form.submitSaveTitle")}
                disabled={isLoading}
                isLoading={isLoading}
                type="submit"
              />
            </Grid>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
