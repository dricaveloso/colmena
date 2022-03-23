// import React, { useContext } from "react";
import React from "react";
import Box from "@material-ui/core/Box";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";
import TextField from "@material-ui/core/TextField";
import IconButton from "@/components/ui/IconButton";
import theme from "@/styles/theme";
import { useSelector } from "react-redux";
import { ChatMessageItemInterfaceCustom } from "@/interfaces/talk";
import { PropsUserSelector } from "@/types/index";
import { addSingleMessage } from "@/store/idb/models/chat";
// import { reloadChatLocalMessages } from "@/store/actions/honeycomb";
import { v4 as uuid } from "uuid";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";

const useStyles = makeStyles(() => ({
  container: {
    position: "fixed",
    flexDirection: "row",
    bottom: 42,
    left: 0,
    width: "98%",
    marginTop: 1,
    marginLeft: 1,
    marginRight: 1,
    paddingBottom: 1,
    backgroundColor: "#fff",
  },
}));

type MyFormValues = {
  message: string;
};

type Props = {
  token: string;
  handleSendMessage: (message: string, referenceId: string) => void;
};

export default function InputSendMessage({ handleSendMessage, token }: Props) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const { t: c } = useTranslation("common");
  const classes = useStyles();

  const initialValues: MyFormValues = {
    message: "",
  };

  const ValidationSchema = Yup.object().shape({
    message: Yup.string().required(c("form.requiredTitle")),
  });

  return (
    <Box className={classes.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={(values: MyFormValues, { setSubmitting, resetForm }: any) => {
          (async () => {
            setSubmitting(true);
            const referenceId = uuid();
            const { message } = values;
            const messageObj: ChatMessageItemInterfaceCustom = {
              token,
              actorType: "users",
              actorId: userRdx.user.id,
              actorDisplayName: userRdx.user.name,
              timestamp: new Date().getTime() / 1000,
              message,
              systemMessage: "",
              messageType: "comment",
              referenceId,
            };
            await addSingleMessage(messageObj);
            document.dispatchEvent(
              new CustomEvent("new-message", {
                detail: { message: messageObj },
              }),
            );
            await handleSendMessage(message, referenceId);
            setSubmitting(false);
          })();
          resetForm();
        }}
      >
        {({ submitForm, isSubmitting }: any) => (
          <Form
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitForm();
              }
            }}
            style={{ width: "100%" }}
          >
            <Box display="flex" flexDirection="row" flex={1}>
              {/* <IconButton
                icon="clip"
                iconColor={theme.palette.icon.main}
                component="a"
                size="small"
                fontSizeIcon="small"
                // style={{ margin: 0, padding: 0, backgroundColor: "tomato", width: 25 }}
                handleClick={() => {
                  notificationCtx.showNotification({
                    message: c("featureUnavailable"),
                    status: NotificationStatusEnum.WARNING,
                  });
                }}
              /> */}
              <Field name="message" InputProps={{ notched: true }}>
                {({ field }: FieldProps) => (
                  <TextField
                    margin="dense"
                    id="message"
                    variant="outlined"
                    placeholder={c("typeYourMessage")}
                    type="text"
                    inputProps={{
                      autoComplete: "off",
                      form: {
                        autoComplete: "off",
                      },
                    }}
                    style={{ fontSize: 12 }}
                    fullWidth
                    {...field}
                  />
                )}
              </Field>
              <IconButton
                className={classNames("rtl:-scale-x-100")}
                icon="send"
                iconColor={!isSubmitting ? theme.palette.primary.main : theme.palette.icon.main}
                handleClick={submitForm}
                disabled={isSubmitting}
              />
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
