import React from "react";
import Box from "@material-ui/core/Box";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";
import TextField from "@material-ui/core/TextField";
import IconButton from "@/components/ui/IconButton";
import theme from "@/styles/theme";
import { useDispatch, useSelector } from "react-redux";
import { addChatMessage } from "@/store/actions/honeycomb";
import { ChatMessageItemInterface } from "@/interfaces/talk";
import { PropsUserSelector } from "@/types/index";

type MyFormValues = {
  message: string;
};

type Props = {
  handleSendMessage: (message: string) => void;
};

export default function InputSendMessage({ handleSendMessage }: Props) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const dispatch = useDispatch();
  const { t: c } = useTranslation("common");

  const initialValues: MyFormValues = {
    message: "",
  };

  const ValidationSchema = Yup.object().shape({
    message: Yup.string().required(c("form.requiredTitle")),
  });

  return (
    <Box
      position="fixed"
      flexDirection="row"
      bottom={0}
      left={0}
      width="98%"
      marginTop={1}
      marginLeft={1}
      marginRight={1}
      paddingBottom={1}
      style={{ backgroundColor: "#fff" }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={(values: MyFormValues, { setSubmitting, resetForm }: any) => {
          setSubmitting(true);
          const { message } = values;
          (async () => {
            try {
              const messageObj: ChatMessageItemInterface = {
                actorType: "users",
                actorId: userRdx.user.id,
                actorDisplayName: userRdx.user.name,
                timestamp: new Date().getTime() / 1000,
                message,
                systemMessage: "",
                messageType: "comment",
              };
              dispatch(addChatMessage(messageObj));
              handleSendMessage(message);
            } catch (e) {
              console.log(e);
            } finally {
              setSubmitting(false);
              resetForm();
            }
          })();
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
              <Field name="message" InputProps={{ notched: true }}>
                {({ field }: FieldProps) => (
                  <TextField
                    margin="dense"
                    id="message"
                    variant="outlined"
                    placeholder="Digite sua mensagem"
                    type="text"
                    style={{ fontSize: 12 }}
                    fullWidth
                    {...field}
                  />
                )}
              </Field>
              <IconButton
                icon="send"
                color={!isSubmitting ? theme.palette.primary.main : "#737373"}
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
