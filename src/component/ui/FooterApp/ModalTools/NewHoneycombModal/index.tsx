import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Button from "@/components/ui/Button";
import { Formik, Form, Field, FieldProps } from "formik";
import ErrorMessageForm from "@/components/ui/ErrorFormMessage";
import Divider from "@/components/ui/Divider";
import * as Yup from "yup";
import { ButtonColorEnum, ButtonVariantEnum, EnvironmentEnum, TextVariantEnum } from "@/enums/*";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "next-i18next";
import { createNewConversation, addParticipantToConversation } from "@/services/talk/room";
import Box from "@material-ui/core/Box";
import UsersList from "./UsersList";
import { listAllUsers } from "@/services/ocs/users";
import UserListSkeleton from "@/components/ui/skeleton/UsersList";
import { useRouter } from "next/router";
import { toast } from "@/utils/notifications";
import { useDispatch, useSelector } from "react-redux";
import { addHoneycomb } from "@/store/actions/honeycomb";
import { PropsUserSelector } from "@/types/*";
import { createDirectory, existDirectory } from "@/services/webdav/directories";
import { addLibraryFile } from "@/store/actions/library";
import { LibraryItemInterface, TimeDescriptionInterface } from "@/interfaces/index";
import { dateDescription } from "@/utils/utils";
import { createShare } from "@/services/share/share";
import Text from "@/components/ui/Text";

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
    padding: theme.spacing(3),
    width: "90vw",
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

type MyFormValues = {
  room: string;
  description: string;
};

export default function NewHoneycombModal({ open, handleClose }: Props) {
  const { t: c } = useTranslation("common");
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const userId = userRdx.user.id;
  const { data } = listAllUsers();
  const [step, setStep] = useState(1);
  const [participants, setParticipants] = useState<string[]>([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();
  const timeDescription: TimeDescriptionInterface = c("timeDescription", { returnObjects: true });
  const [errorMessageValidation, setErrorMessageValidation] = useState("");

  const initialValues = {
    room: "",
  };

  const schemaValidation = Yup.object().shape({
    room: Yup.string().required(c("form.requiredTitle")),
  });

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
              {c("addHoneycombTitle")}
            </h4>
            <Formik
              initialValues={initialValues}
              validationSchema={schemaValidation}
              onSubmit={(values: MyFormValues, { setSubmitting }: any) => {
                const { room: room2 } = values;
                const room = room2.trim();
                (async () => {
                  try {
                    setErrorMessageValidation("");
                    setSubmitting(true);

                    if (userRdx.user.id === room) {
                      throw new Error(c("reservedNameError"));
                    }

                    if (room.indexOf("/") !== -1) {
                      throw new Error(
                        c("form.slashNotAllowed", {
                          field: c("form.fields.name"),
                        }),
                      );
                    }

                    const directoryExists = await existDirectory(userId, room);
                    if (directoryExists) {
                      throw new Error(c("honeycombModal.errorCreatePanal"));
                    }

                    const conversation = await createNewConversation(room);
                    const { token, canDeleteConversation } = conversation.data.ocs.data;

                    participants.forEach(async (item) => {
                      await addParticipantToConversation(token, item);
                    });
                    dispatch(addHoneycomb(conversation.data.ocs.data));

                    const folderName = conversation.data.ocs.data.displayName;

                    const create = await createDirectory(userId, folderName);
                    if (create) {
                      const date = new Date();
                      const item: LibraryItemInterface = {
                        basename: folderName,
                        id: "",
                        filename: "",
                        aliasFilename: "",
                        type: "directory",
                        environment: EnvironmentEnum.REMOTE,
                        createdAt: date,
                        createdAtDescription: dateDescription(date, timeDescription),
                      };
                      dispatch(addLibraryFile(item));
                      await createShare(token, folderName);
                    }

                    handleClose();
                    toast(c("honeycombModal.chatRoomSuccess"), "success");
                    router.push(`/honeycomb/${token}/${room}/${!canDeleteConversation ? 0 : 1}`);
                  } catch (e) {
                    const msg = e.message ? e.message : c("honeycombModal.chatRoomFailed");
                    setErrorMessageValidation(msg);
                  } finally {
                    setSubmitting(false);
                  }
                })();
              }}
            >
              {({ submitForm, isSubmitting, errors, touched, values }: any) => (
                <Form className={classes.form}>
                  {step === 1 && (
                    <>
                      <Field name="room" InputProps={{ notched: true }}>
                        {({ field }: FieldProps) => (
                          <TextField
                            id="room"
                            autoComplete="off"
                            label={c("form.fields.name")}
                            variant="outlined"
                            inputProps={{ maxLength: 60 }}
                            {...field}
                          />
                        )}
                      </Field>
                      {errors.room && touched.room ? (
                        <ErrorMessageForm message={errors.room} />
                      ) : null}
                      <Divider marginTop={20} />
                      <Button
                        handleClick={() => setStep(2)}
                        title={c("honeycombModal.buttonStep1")}
                        disabled={!(values.room !== "")}
                        color={ButtonColorEnum.PRIMARY}
                        variant={ButtonVariantEnum.CONTAINED}
                        style={{ float: "right" }}
                      />
                    </>
                  )}
                  {step === 2 && (
                    <>
                      {!data ? (
                        <UserListSkeleton />
                      ) : (
                        <UsersList
                          participants={participants}
                          updateParticipants={(part) => setParticipants(part)}
                          users={data.ocs.data.users}
                        />
                      )}
                      <Box
                        display="flex"
                        flex="1"
                        flexDirection="row"
                        justifyContent="space-between"
                        marginTop={1}
                      >
                        <Button
                          handleClick={() => setStep(1)}
                          color={ButtonColorEnum.PRIMARY}
                          variant={ButtonVariantEnum.OUTLINED}
                          title={c("form.backButton")}
                        />
                        <Button
                          handleClick={submitForm}
                          color={ButtonColorEnum.PRIMARY}
                          variant={ButtonVariantEnum.CONTAINED}
                          disabled={isSubmitting}
                          title={
                            isSubmitting ? (
                              <>
                                <CircularProgress
                                  color="secondary"
                                  size={16}
                                  style={{ marginRight: 8 }}
                                />{" "}
                                {c("form.loadingTitle")}
                              </>
                            ) : (
                              c("honeycombModal.buttonStep2")
                            )
                          }
                        />
                      </Box>
                      {errorMessageValidation !== "" && (
                        <Box
                          display="flex"
                          flex="1"
                          marginTop={1}
                          flexDirection="row"
                          justifyContent="center"
                        >
                          <Text variant={TextVariantEnum.BODY2} style={{ color: "tomato" }}>
                            {errorMessageValidation}
                          </Text>
                        </Box>
                      )}
                    </>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
