import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { createDirectory, existDirectory } from "@/services/webdav/directories";
import { PropsLibrarySelector, PropsUserSelector } from "@/types/index";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, FieldProps, ErrorMessage } from "formik";
import Divider from "@/components/ui/Divider";
import * as Yup from "yup";
import { dateDescription, removeFirstSlash, trailingSlash } from "@/utils/utils";
import { addLibraryFile } from "@/store/actions/library";
import { LibraryItemInterface, TimeDescriptionInterface } from "@/interfaces/index";
import { EnvironmentEnum, NotificationStatusEnum } from "@/enums/*";
import CircularProgress from "@material-ui/core/CircularProgress";
import NotificationContext from "@/store/context/notification-context";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import { useTranslation } from "next-i18next";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { margin: theme.spacing(0, 0, 4, 0) },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
  },
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
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const userId = userRdx.user.id;
  const library = useSelector((state: { library: PropsLibrarySelector }) => state.library);
  const path = library.currentPath;
  const pathExists = library.currentPathExists;
  const classes = useStyles();
  const notificationCtx = useContext(NotificationContext);
  const [finalPath, setFinalPath] = useState(path);
  const [handledPath, setHandledPath] = useState("/");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation("common");
  const timeDescription: TimeDescriptionInterface = t("timeDescription", { returnObjects: true });
  const dispatch = useDispatch();
  const initialValues = {
    name: "",
    path,
  };

  const handleSubmit = (values: any) => {
    setIsLoading(true);
    (async () => {
      try {
        const directoryExists = await existDirectory(userId, finalPath);
        if (directoryExists) {
          throw new Error(t("messages.directoryAlreadyExists"));
        }

        const create = await createDirectory(userId, finalPath);
        if (create) {
          const date = new Date();
          const item: LibraryItemInterface = {
            basename: values.name,
            id: removeFirstSlash(finalPath),
            filename: removeFirstSlash(finalPath),
            type: "directory",
            environment: EnvironmentEnum.REMOTE,
            createdAt: date,
            createdAtDescription: dateDescription(date, timeDescription),
          };
          setIsLoading(false);
          dispatch(addLibraryFile(item));
          handleClose();
        }
      } catch (e) {
        notificationCtx.showNotification({
          message: e.message,
          status: NotificationStatusEnum.ERROR,
        });
        setIsLoading(false);
      }
    })();
  };

  const NewFolderSchema = Yup.object().shape({
    name: Yup.string().required(t("messages.enterFolderName")),
  });

  const handleName = (name: any) => {
    setFinalPath(`${trailingSlash(handledPath)}${name}`);
  };

  useEffect(() => {
    const paths = !pathExists ? "/" : path;
    setHandledPath(paths);
    setFinalPath(paths);

    return () => {
      setHandledPath("");
      setFinalPath("");
      setIsLoading(false);
    };
  }, [path, pathExists]);

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h4 id="transition-modal-title" className={classes.title}>
              {t("newFolderTitle")}
            </h4>
            <Formik
              initialValues={initialValues}
              validationSchema={NewFolderSchema}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ setFieldValue }: any) => (
                <Form className={classes.form}>
                  <Field name="name" InputProps={{ notched: true }}>
                    {({ field }: FieldProps) => (
                      <TextField
                        id="outlined-search"
                        label={t("form.name")}
                        variant="outlined"
                        {...field}
                        onChange={(
                          event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                        ) => setFieldValue("name", event.target.value)}
                        onKeyUp={(event: any) => handleName(event.target.value)}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="name">
                    {(msg) => <ErrorMessageForm message={msg} />}
                  </ErrorMessage>
                  <Divider marginTop={20} />
                  <TextField
                    id="outlined-search"
                    label={t("form.local")}
                    variant="outlined"
                    value={finalPath}
                    disabled
                  />
                  <Divider marginTop={20} />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress color="secondary" size={16} style={{ marginRight: 8 }} />{" "}
                        {t("loading")}..
                      </>
                    ) : (
                      t("form.create")
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
