import React, { useEffect, useState, useCallback, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@/components/ui/Modal";
import TextField from "@material-ui/core/TextField";
import Button from "@/components/ui/Button";
import { copyFile, existFile } from "@/services/webdav/files";
import { existDirectory } from "@/services/webdav/directories";
import { PropsLibrarySelector, PropsUserSelector } from "@/types/index";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, FieldProps, ErrorMessage } from "formik";
import Divider from "@/components/ui/Divider";
import * as Yup from "yup";
import {
  dateDescription,
  trailingSlash,
  getExtensionFilename,
  getOnlyFilename,
  getRandomInt,
} from "@/utils/utils";
import {
  getRootPath,
  handleDirectoryName,
  handleFileName,
  convertPrivateToUsername,
  convertUsernameToPrivate,
} from "@/utils/directory";
import { toast } from "@/utils/notifications";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import { useTranslation } from "next-i18next";
import { EnvironmentEnum } from "@/enums/*";
import { addLibraryFile } from "@/store/actions/library";
import {
  LibraryCardItemInterface,
  LibraryItemInterface,
  TimeDescriptionInterface,
} from "@/interfaces/index";
import { createFile, getFile } from "@/store/idb/models/files";

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
  handleOpen: (opt: boolean) => void;
  cardItem: LibraryCardItemInterface;
};

export default function DuplicateItemModal({ open, handleOpen, cardItem }: Props) {
  const { id, type, filename, aliasFilename, basename } = cardItem;
  const { t } = useTranslation("common");
  const { t: l } = useTranslation("library");
  const library = useSelector((state: { library: PropsLibrarySelector }) => state.library);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const path = library.currentPath;
  const classes = useStyles();
  const [finalPath, setFinalPath] = useState(filename);
  const [aliasPath, setAliasPath] = useState(aliasFilename);
  const [isLoading, setIsLoading] = useState(false);
  const timeDescription: TimeDescriptionInterface = t("timeDescription", { returnObjects: true });
  const dispatch = useDispatch();
  const initialValues = {
    name: getOnlyFilename(basename),
    path: aliasPath,
  };
  const extension = useMemo(() => getExtensionFilename(basename), [basename]);
  interface File {
    id: string;
    filename: string;
    basename: string;
  }

  const handleSubmit = (values: any) => {
    setIsLoading(true);
    (async () => {
      try {
        const userId = userRdx.user.id;
        let name = values.name.trim();
        console.log(finalPath, cardItem.filename);
        if (finalPath === cardItem.filename) {
          name += `-${getRandomInt(1000, 9999)}`;
        }

        if (extension) {
          name += `.${extension}`;
        }

        const newFilename = filename.replace(/\/[^/]*$/, `/${name}`);
        console.log(newFilename);

        let duplicated: boolean | File = false;

        switch (cardItem.environment) {
          case EnvironmentEnum.REMOTE:
            duplicated = await duplicateRemoteItem(userId, newFilename);
            break;
          case EnvironmentEnum.LOCAL:
            duplicated = await duplicateLocalItem(name, newFilename);
            break;
          case EnvironmentEnum.BOTH:
            duplicated = await duplicateRemoteItem(userId, newFilename);
            if (duplicated) {
              duplicated = await duplicateLocalItem(name, newFilename);
            }
            break;
          default:
            break;
        }

        if (duplicated) {
          let item: LibraryItemInterface = {} as LibraryItemInterface;
          const date = new Date();
          if (typeof duplicated === "boolean") {
            // eslint-disable-next-line
            const newId = id.replace(/\/[^\/]*$/, `/${name}`);
            item = {
              ...cardItem,
              basename: name,
              id: newId,
              filename: newFilename,
              aliasFilename: convertPrivateToUsername(newFilename, userId),
              createdAt: date,
              createdAtDescription: dateDescription(date, timeDescription),
            };
          } else {
            item = {
              ...cardItem,
              id: duplicated.id,
              basename: duplicated.basename,
              filename: duplicated.filename,
              createdAt: date,
              createdAtDescription: dateDescription(date, timeDescription),
            };
          }

          if (cardItem.type === "directory") {
            toast(l("messages.directorySuccessfullyDuplicated"), "success");
          } else {
            toast(l("messages.fileSuccessfullyDuplicated"), "success");
          }

          dispatch(addLibraryFile(item));
          setIsLoading(false);
          handleOpen(false);
        }
      } catch (e) {
        toast(e.message, "error");
        setIsLoading(false);
      }
    })();
  };

  const duplicateRemoteItem = useCallback(
    async (userId, finalPath) => {
      if (type === "directory") {
        const directoryExists = await existDirectory(userId, finalPath);
        if (directoryExists) {
          throw new Error(t("messages.directoryAlreadyExists"));
        }
      } else {
        const fileExists = await existFile(userId, finalPath);
        if (fileExists) {
          throw new Error(l("messages.fileAlreadyExists"));
        }
      }

      return copyFile(userId, filename, finalPath);
    },
    [filename, l, t, type],
  );

  const duplicateLocalItem = useCallback(
    async (basename, finalPath) => {
      const file = await getFile(cardItem.id);
      const newFile = {
        ...file,
        id: undefined,
        basename,
        filename: finalPath,
        aliasFilename: convertPrivateToUsername(finalPath, userRdx.user.id),
      };

      const id = createFile(newFile);

      return { ...newFile, id };
    },
    [cardItem.id, userRdx.user.id],
  );

  const DuplicateItemSchema = Yup.object().shape({
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
    <Modal title={l("duplicateTitle")} handleClose={() => handleOpen(false)} open={open}>
      <Formik
        initialValues={initialValues}
        validationSchema={DuplicateItemSchema}
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
              title={l("duplicateButton")}
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
