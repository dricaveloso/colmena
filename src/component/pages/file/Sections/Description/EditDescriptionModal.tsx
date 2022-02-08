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
  customdescription: string;
}

type Props = {
  open: boolean;
  closeModal: () => void;
  data: LibraryItemInterface;
  setData: React.Dispatch<React.SetStateAction<LibraryItemInterface>>;
};

export default function EditDescriptionModal({ open, closeModal, data, setData }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation("file");
  const { t: c } = useTranslation("common");
  const cookies = parseCookies();
  const language = cookies.NEXT_LOCALE || "en";
  const initialValues = {
    customdescription: data && data.description ? data.description : "",
  };

  const editDescriptionField = async (values: IForm) => {
    const { customdescription } = values;
    setIsLoading(true);

    try {
      await setDataFile({ customdescription, language }, `${data.filename}`);
      setData({ ...data, description: customdescription });
      toast(t("messages.descriptionSuccessfullyUpdated"), "success");
      closeModal();
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title={t("editDescription")} handleClose={closeModal} open={open}>
      <Formik initialValues={initialValues} onSubmit={(values) => editDescriptionField(values)}>
        {({ setFieldValue }: any) => (
          <Form>
            <Field name="customdescription" InputProps={{ notched: true }}>
              {({ field }: FieldProps) => (
                <TextField
                  id="customdescription"
                  label={t("descriptionTitle")}
                  variant="outlined"
                  inputProps={{ maxLength: 60 }}
                  style={{
                    width: "100%",
                  }}
                  {...field}
                  value={field.value ? decodeURI(field.value) : ""}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                    setFieldValue("customdescription", event.target.value)
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
