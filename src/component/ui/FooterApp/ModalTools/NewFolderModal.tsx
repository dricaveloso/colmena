import React, { useEffect, useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@/components/ui/Modal";
import TextField from "@material-ui/core/TextField";
import Button from "@/components/ui/Button";
import { createDirectory, existDirectory } from "@/services/webdav/directories";
import { PropsLibrarySelector, PropsUserSelector } from "@/types/index";
import { useSelector } from "react-redux";
import { Formik, Form, Field, FieldProps, ErrorMessage } from "formik";
import Divider from "@/components/ui/Divider";
import * as Yup from "yup";
import { removeFirstSlash, removeLastSlash, trailingSlash } from "@/utils/utils";
import {
  hasLocalPath,
  getRootPath,
  handleDirectoryName,
  convertUsernameToPrivate,
  convertPrivateToUsername,
} from "@/utils/directory";
import { toast } from "@/utils/notifications";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Box } from "@material-ui/core";
import { ButtonColorEnum, ButtonSizeEnum, ButtonVariantEnum, TextVariantEnum } from "@/enums/*";
import LibraryModal from "@/components/ui/LibraryModal";
import { LibraryItemInterface } from "@/interfaces/index";
import Text from "@/components/ui/Text";

const useStyles = makeStyles(() => ({
  form: {
    "& .MuiTextField-root": {
      width: "100%",
    },
  },
  submit: {
    float: "right",
  },
}));

type Props = {
  open: boolean;
  handleClose: () => void;
};

export default function NewFolderModal({ open, handleClose }: Props) {
  const { t } = useTranslation("common");
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const userId = userRdx.user.id;
  const library = useSelector((state: { library: PropsLibrarySelector }) => state.library);
  const currentLibraryPath = library.currentPath;
  const pathExists = library.currentPathExists;
  const classes = useStyles();
  const router = useRouter();
  const [path, setPath] = useState(currentLibraryPath);
  const [folderName, setFolderName] = useState("");
  const [finalPath, setFinalPath] = useState(path);
  const [isLoading, setIsLoading] = useState(false);
  const [openLibrary, setOpenLibrary] = useState(false);
  const initialValues = {
    folderName: "",
  };

  // eslint-disable-next-line no-unused-vars
  const handleSubmit = () => {
    setIsLoading(true);
    (async () => {
      try {
        const realPath = convertUsernameToPrivate(finalPath, userId);
        const directoryExists = await existDirectory(userId, realPath);
        if (directoryExists) {
          throw new Error(t("messages.directoryAlreadyExists"));
        }

        const handledPath: string = removeFirstSlash(realPath) ?? "";
        if (hasLocalPath(handledPath)) {
          throw new Error(t("messages.directoryAlreadyExists"));
        }

        const create = await createDirectory(userId, realPath);
        if (create) {
          const timer = 5000;

          toast(t("messages.directoryCreatedSuccessfully"), "success", { timer });
          setTimeout(() => {
            router.push(`/library/${removeFirstSlash(finalPath)}`);
          }, timer);
        }
      } catch (e) {
        toast(e.message, "error");
        setIsLoading(false);
      }
    })();
  };

  const NewFolderSchema = Yup.object().shape({
    folderName: Yup.string().required(t("form.requiredTitle")),
  });

  const treatName = (name: string) => handleDirectoryName(name);

  const handleName = (name: string) => {
    setFolderName(treatName(name.trim()));
  };

  const definePath = useCallback(() => {
    const rootPath = getRootPath();
    return !pathExists || !path || path === "/" ? convertPrivateToUsername(rootPath, userId) : path;
  }, [path, pathExists, userId]);

  const libraryOptions = (item: LibraryItemInterface) => {
    if (item.type === "directory") {
      return (
        <Button
          handleClick={() => handleChangeLocation(item.aliasFilename)}
          title={t("changeLocationButton")}
          size={ButtonSizeEnum.SMALL}
        />
      );
    }

    return null;
  };

  const footerActions = (item: LibraryItemInterface) => (
    <Button
      handleClick={() => handleChangeLocation(item.aliasFilename)}
      title={t("changeLocationButton")}
      size={ButtonSizeEnum.SMALL}
    />
  );

  const defineFinalPath = useCallback(() => {
    setFinalPath(removeLastSlash(trailingSlash(definePath()) + folderName));
  }, [definePath, folderName]);

  const handleChangeLocation = (path: string) => {
    setPath(path);
    setOpenLibrary(false);
  };

  useEffect(() => {
    defineFinalPath();

    return () => {
      setFinalPath("");
      setIsLoading(false);
    };
  }, [path, definePath, defineFinalPath]);

  return (
    <>
      <Modal title={t("addFolderTitle")} handleClose={handleClose} open={open}>
        <Formik
          initialValues={initialValues}
          validationSchema={NewFolderSchema}
          onSubmit={handleSubmit}
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
              <Field name="folderName" InputProps={{ notched: true }}>
                {({ field }: FieldProps) => (
                  <TextField
                    id="outlined-search"
                    inputProps={{
                      maxLength: 60,
                      autocomplete: "off",
                      form: {
                        autocomplete: "off",
                      },
                    }}
                    label={t("form.fields.name")}
                    variant="outlined"
                    {...field}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                      setFieldValue("folderName", treatName(event.target.value))
                    }
                    onKeyUp={(event: any) => handleName(event.target.value)}
                  />
                )}
              </Field>
              <ErrorMessage name="folderName">
                {(msg) => <ErrorMessageForm message={msg} />}
              </ErrorMessage>
              <Divider marginTop={20} />
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
                    {t("form.location")}
                  </Text>
                  <Text variant={TextVariantEnum.BODY2}>{`/${finalPath}`}</Text>
                </Box>
                <Button
                  handleClick={() => setOpenLibrary(true)}
                  style={{ margin: 8 }}
                  variant={ButtonVariantEnum.TEXT}
                  color={ButtonColorEnum.PRIMARY}
                  title={t("changeLocationButton")}
                  size={ButtonSizeEnum.SMALL}
                />
              </Box>
              <Divider marginTop={20} />
              <Button
                title={t("form.create")}
                type="submit"
                className={classes.submit}
                disabled={isLoading}
                isLoading={isLoading}
              />
            </Form>
          )}
        </Formik>
      </Modal>
      <LibraryModal
        title={t("changeLocationModalTitle")}
        handleClose={() => setOpenLibrary(false)}
        open={openLibrary}
        options={libraryOptions}
        footerActions={footerActions}
      />
    </>
  );
}
