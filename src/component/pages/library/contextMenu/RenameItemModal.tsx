import React, { useEffect, useState, useCallback, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@/components/ui/Modal";
import TextField from "@material-ui/core/TextField";
import Button from "@/components/ui/Button";
import { moveFile, existFile } from "@/services/webdav/files";
import { existDirectory } from "@/services/webdav/directories";
import { PropsLibrarySelector, PropsUserSelector } from "@/types/index";
import { useSelector, useDispatch } from "react-redux";
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
} from "@/utils/directory";
import { toast } from "@/utils/notifications";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import { useTranslation } from "next-i18next";
import { EnvironmentEnum } from "@/enums/*";
import { editLibraryFile } from "@/store/actions/library";
import { updateFile } from "@/store/idb/models/files";

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
  id: string;
  open: boolean;
  handleOpen: (opt: boolean) => void;
  filename: string;
  aliasFilename: string;
  basename: string;
  type: string;
  environment: EnvironmentEnum;
};

export default function RenameItemModal({
  id,
  open,
  handleOpen,
  filename,
  aliasFilename,
  basename,
  type,
  environment,
}: Props) {
  const { t } = useTranslation("common");
  const { t: l } = useTranslation("library");
  const library = useSelector((state: { library: PropsLibrarySelector }) => state.library);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const path = library.currentPath;
  const classes = useStyles();
  const [finalPath, setFinalPath] = useState(filename);
  const [aliasPath, setAliasPath] = useState(aliasFilename);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const initialValues = {
    name: getOnlyFilename(basename),
    path: finalPath,
  };
  const extension = useMemo(() => getExtensionFilename(basename), [basename]);

  const handleSubmit = (values: any) => {
    setIsLoading(true);
    (async () => {
      try {
        let moved = false;
        const userId = userRdx.user.id;
        let name = values.name.trim();
        if (extension) {
          name += `.${extension}`;
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

        if (!moved) {
          throw new Error(l("messages.unableToCompleteRequest"));
        }

        dispatch(editLibraryFile({ id, filename: finalPath, basename: name }));
        setIsLoading(false);
        handleOpen(false);
      } catch (e) {
        toast(e.message, "error");
        setIsLoading(false);
      }
    })();
  };

  const renameRemoteItem = useCallback(
    async (userId) => {
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
    async (name) =>
      updateFile(id, {
        basename: name,
        filename: finalPath,
        aliasFilename: aliasPath,
      }),
    [aliasPath, finalPath, id],
  );

  const RenameItemSchema = Yup.object().shape({
    name: Yup.string().required(t("form.requiredTitle")),
  });

  const defineFinalPath = (name: any) => {
    let aliasPath = `${trailingSlash(definePath(path))}${treatName(name)}`;
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

  useEffect(() => {
    setFinalPath(definePath(filename));

    return () => {
      setFinalPath("");
      setIsLoading(false);
    };
  }, [path, definePath, filename]);

  return (
    <Modal title={l("renameTitle")} handleClose={() => handleOpen(false)} open={open}>
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
            <Button
              title={l("saveButton")}
              type="submit"
              className={classes.submit}
              disabled={isLoading}
              isLoading={isLoading}
            />
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
