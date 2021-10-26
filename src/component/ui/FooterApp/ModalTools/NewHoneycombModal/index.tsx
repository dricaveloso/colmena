import React, { useState, useContext } from "react";
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
import { NotificationStatusEnum, ButtonColorEnum, ButtonVariantEnum } from "@/enums/*";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "next-i18next";
import { createNewConversation, addParticipantToConversation } from "@/services/talk/room";
import Box from "@material-ui/core/Box";
import UsersList from "./UsersList";
import { listAllUsers } from "@/services/ocs/users";
import UserListSkeleton from "@/components/ui/skeleton/UsersList";
import { useRouter } from "next/router";
import NotificationContext from "@/store/context/notification-context";
import { useDispatch } from "react-redux";
import { addHoneycomb } from "@/store/actions/honeycomb";

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
  roomName: string;
  description: string;
};

export default function NewHoneycombModal({ open, handleClose }: Props) {
  const { t: c } = useTranslation("common");
  const { data } = listAllUsers();
  const [step, setStep] = useState(1);
  const [participants, setParticipants] = useState<string[]>([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();
  const notificationCtx = useContext(NotificationContext);

  const initialValues = {
    roomName: "",
  };

  const schemaValidation = Yup.object().shape({
    roomName: Yup.string().required(c("form.requiredTitle")),
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
                const { roomName } = values;
                (async () => {
                  try {
                    setSubmitting(true);
                    const conversation = await createNewConversation(roomName);
                    const { token } = conversation.data.ocs.data;

                    participants.forEach(async (item) => {
                      await addParticipantToConversation(token, item);
                    });
                    dispatch(addHoneycomb(conversation.data.ocs.data));
                    handleClose();
                    notificationCtx.showNotification({
                      message: c("honeycombModal.chatRoomSuccess"),
                      status: NotificationStatusEnum.SUCCESS,
                    });
                    router.push(`/honeycomb/${token}/${roomName}/${participants.length}`);
                  } catch (e) {
                    console.log(e);
                    notificationCtx.showNotification({
                      message: c("honeycombModal.chatRoomFailed"),
                      status: NotificationStatusEnum.ERROR,
                    });
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
                      <Field name="roomName" InputProps={{ notched: true }}>
                        {({ field }: FieldProps) => (
                          <TextField
                            id="outlined-search"
                            label={c("form.fields.name")}
                            variant="outlined"
                            {...field}
                          />
                        )}
                      </Field>
                      {errors.roomName && touched.roomName ? (
                        <ErrorMessageForm message={errors.roomName} />
                      ) : null}
                      <Divider marginTop={20} />
                      <Divider marginTop={20} />
                      <Button
                        handleClick={() => setStep(2)}
                        title={c("honeycombModal.addParticipantsTitle")}
                        disabled={!(values.roomName !== "")}
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
                          disabled={isSubmitting || participants.length === 0}
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
                              c("form.submitCreateTitle")
                            )
                          }
                        />
                      </Box>
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
