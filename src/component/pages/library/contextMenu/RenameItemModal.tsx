import React, { useEffect, useState, useCallback, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@/components/ui/Modal";
import TextField from "@material-ui/core/TextField";
import Button from "@/components/ui/Button";
import { moveFile, existFile } from "@/services/webdav/files";
import { existDirectory } from "@/services/webdav/directories";
import { PropsLibrarySelector, PropsUserSelector } from "@/types/index";
import { useSelector } from "react-redux";
import { Formik, Form, Field, FieldProps, ErrorMessage } from "formik";
import Divider from "@/components/ui/Divider";
import * as Yup from "yup";
import {
  getExtensionFilename,
  getOnlyFilename,
  removeFirstSlash,
  trailingSlash,
} from "@/utils/utils";
import {
  hasLocalPath,
  getRootPath,
  handleDirectoryName,
  handleFileName,
  convertUsernameToPrivate,
  getPath,
} from "@/utils/directory";
import { toast } from "@/utils/notifications";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import { useTranslation } from "next-i18next";
import {
  ButtonColorEnum,
  ButtonVariantEnum,
  ContextMenuEventEnum,
  ContextMenuOptionEnum,
  EnvironmentEnum,
} from "@/enums/*";
import { updateFile } from "@/store/idb/models/files";
import { Box } from "@material-ui/core";
import ActionConfirm from "@/components/ui/ActionConfirm";
import { LibraryItemContextMenuInterface, LibraryItemInterface } from "@/interfaces/index";

const useStyles = makeStyles(() => ({
  form: {
    "& .MuiTextField-root": {
      width: "100%",
    },
  },
  submit: {
    marginLeft: 10,
  },
}));

type Props = {
  handleOpen: (opt: boolean) => void;
  open: boolean;
  cardItem: LibraryItemContextMenuInterface;
};

let requestCancel = false;

export default function RenameItemModal({ cardItem, open, handleOpen }: Props) {
  const { id, filename, aliasFilename, basename, type, environment, onChange } = cardItem;
  const { t } = useTranslation("common");
  const { t: l } = useTranslation("library");
  const library = useSelector((state: { library: PropsLibrarySelector }) => state.library);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const path = library.currentPath;
  const classes = useStyles();
  const [finalPath, setFinalPath] = useState(filename);
  const [aliasPath, setAliasPath] = useState(aliasFilename);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [cancelIsLoading, setCancelIsLoading] = useState(false);
  const initialValues = {
    name: getOnlyFilename(basename),
    path: finalPath,
  };
  const extension = useMemo(() => getExtensionFilename(basename), [basename]);

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      let moved = false;
      const userId = userRdx.user.id;
      let name = values.name.trim();
      if (extension) {
        name += `.${extension}`;
      }

      if (requestCancel) {
        return;
      }

      switch (environment) {
        case EnvironmentEnum.REMOTE:
          moved = await renameRemoteItem(userId);
          break;
        case EnvironmentEnum.LOCAL:
          moved = await renameLocalItem(name);
          break;
        case EnvironmentEnum.BOTH:
          moved = await renameRemoteItem(userId);
          if (moved) {
            moved = await renameLocalItem(name);
          }
          break;
        default:
          throw new Error(l("messages.unidentifiedEnvironment"));
      }

      if (requestCancel) {
        if (moved) {
          undoChange(userId);
        }

        return;
      }

      if (!moved) {
        throw new Error(l("messages.unableToCompleteRequest"));
      }

      setShowConfirmCancel(false);

      if (type === "directory") {
        toast(l("messages.directorySuccessfullyRenamed"), "success");
      } else {
        toast(l("messages.fileSuccessfullyRenamed"), "success");
      }

      const updatedItem = {
        ...cardItem,
        id,
        filename: finalPath,
        basename: name,
      } as LibraryItemInterface;

      await onChange(updatedItem, ContextMenuEventEnum.UPDATE, ContextMenuOptionEnum.RENAME);
      setIsLoading(false);
      handleOpen(false);
    } catch (e) {
      toast(e.message, "error");
      setIsLoading(false);
    }
  };

  const undoChange = useCallback(
    async (userId: string) => {
      switch (environment) {
        case EnvironmentEnum.REMOTE:
          await moveFile(userId, finalPath, filename);
          break;
        case EnvironmentEnum.LOCAL:
          await updateFile(id, {
            basename,
            filename,
            aliasFilename,
          });
          break;
        case EnvironmentEnum.BOTH:
          if (await moveFile(userId, finalPath, filename)) {
            await updateFile(id, {
              basename,
              filename,
              aliasFilename,
            });
          }
          break;
        default:
          break;
      }
    },
    [aliasFilename, basename, environment, filename, finalPath, id],
  );

  const renameRemoteItem = useCallback(
    async (userId) => {
      if (requestCancel) {
        return false;
      }

      if (type === "directory") {
        const directoryExists = await existDirectory(userId, finalPath);
        if (directoryExists) {
          throw new Error(t("messages.directoryAlreadyExists"));
        }

        const handledPath: string = removeFirstSlash(finalPath) ?? "";
        if (hasLocalPath(handledPath)) {
          throw new Error(t("messages.directoryAlreadyExists"));
        }
      } else {
        const fileExists = await existFile(userId, finalPath);
        if (fileExists) {
          throw new Error(l("messages.fileAlreadyExists"));
        }
      }

      return moveFile(userId, filename, finalPath);
    },
    [filename, finalPath, l, t, type],
  );

  const renameLocalItem = useCallback(
    async (name) => {
      if (requestCancel) {
        return false;
      }

      return updateFile(id, {
        basename: name,
        filename: finalPath,
        aliasFilename: aliasPath,
      });
    },
    [aliasPath, finalPath, id],
  );

  const RenameItemSchema = Yup.object().shape({
    name: Yup.string().required(t("form.requiredTitle")),
  });

  const defineFinalPath = (name: any) => {
    let aliasPath = `${trailingSlash(definePath(getPath(cardItem.filename)))}${treatName(name)}`;
    if (extension) {
      aliasPath += `.${extension}`;
    }

    setFinalPath(convertUsernameToPrivate(aliasPath, userRdx.user.id));
    setAliasPath(aliasPath);
  };

  const treatName = (name: string) => {
    if (type === "directory") {
      return handleDirectoryName(name);
    }

    return handleFileName(name);
  };

  const definePath = useCallback((path) => {
    const rootPath = getRootPath();
    return !path || path === "/" ? rootPath : path;
  }, []);

  const handleClose = useCallback(() => {
    handleOpen(false);
  }, [handleOpen]);

  const confirmClose = useCallback(() => {
    if (isLoading) {
      setShowConfirmCancel(true);
    } else {
      handleClose();
    }
  }, [handleClose, isLoading]);

  const requestAbortUpload = () => {
    setCancelIsLoading(true);
    requestCancel = true;
    toast(l("messages.itemRenamingCanceledSuccessfully"), "success");
    handleClose();
  };

  useEffect(() => {
    setFinalPath(definePath(filename));

    return () => {
      setFinalPath("");
      setIsLoading(false);
    };
  }, [path, definePath, filename]);

  return (
    <>
      <Modal
        data-testid="modal-rename-item"
        title={l("renameTitle")}
        open={open}
        handleClose={isLoading ? undefined : handleClose}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={RenameItemSchema}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ setFieldValue }: any) => (
            <Form className={classes.form}>
              <Field name="name" InputProps={{ notched: true }}>
                {({ field }: FieldProps) => (
                  <TextField
                    id="outlined-search"
                    label={t("form.fields.name")}
                    variant="outlined"
                    inputProps={{ maxLength: 60 }}
                    {...field}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                      setFieldValue("name", treatName(event.target.value))
                    }
                    onKeyUp={(event: any) => defineFinalPath(event.target.value)}
                  />
                )}
              </Field>
              <ErrorMessage name="name">{(msg) => <ErrorMessageForm message={msg} />}</ErrorMessage>
              <Divider marginTop={20} />
              <TextField
                id="outlined-search"
                label={t("form.local")}
                variant="outlined"
                value={aliasPath}
                disabled
              />
              <Divider marginTop={20} />
              <Box display="flex" justifyContent="flex-end" width="100%">
                {isLoading && (
                  <Button
                    handleClick={confirmClose}
                    title={t("form.cancelButton")}
                    data-cy="cancel"
                    color={ButtonColorEnum.DEFAULT}
                    variant={ButtonVariantEnum.OUTLINED}
                  />
                )}
                <Button
                  title={l("saveButton")}
                  type="submit"
                  className={classes.submit}
                  disabled={isLoading}
                  isLoading={isLoading}
                />
              </Box>
            </Form>
          )}
        </Formik>
      </Modal>
      {showConfirmCancel && (
        <ActionConfirm
          title={l("confirmCancelItemRenaming")}
          onOk={requestAbortUpload}
          onClose={() => setShowConfirmCancel(false)}
          isLoading={cancelIsLoading}
        />
      )}
    </>
  );
}
