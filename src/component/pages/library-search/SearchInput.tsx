import React, { useState, useEffect } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { InputBase } from "@material-ui/core";
import IconButton from "@/components/ui/IconButton";
import { useTranslation } from "next-i18next";
import { Field, FieldProps, Form, Formik } from "formik";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: "6px 4px",
      display: "flex",
      alignItems: "center",
      width: "100%",
      backgroundColor: "#fff",
    },
    form: {
      width: "100%",
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
      margin: 0,
      minWidth: "auto",
    },
  }),
);

type FormValues = {
  keyword: string;
};

type Props = {
  search: (keyword: string) => void;
  keyword?: string;
};

export default function SearchInput({ search, keyword = "" }: Props) {
  const classes = useStyles();
  const { t } = useTranslation("librarySearch");
  // eslint-disable-next-line no-undef
  const [intervalSearch, setIntervalSearch] = useState<undefined | NodeJS.Timeout>();
  const [submitType, setSubmitType] = useState<"search" | "clear">("search");
  const initialValues: FormValues = {
    keyword,
  };

  const handleSearch = (values: FormValues) => {
    search(values.keyword);
  };

  const handleIntervalSearch = (submitForm: any) => {
    if (intervalSearch) {
      clearTimeout(intervalSearch);
    }

    setIntervalSearch(undefined);
    setIntervalSearch(
      setTimeout(() => {
        submitForm();
      }, 500),
    );
  };

  useEffect(() => {
    if (keyword !== "") {
      setSubmitType("clear");
    }
  }, [keyword]);

  return (
    <Formik initialValues={initialValues} onSubmit={handleSearch}>
      {({ setFieldValue, submitForm }: any) => (
        <Form className={classes.form}>
          <Paper component="div" className={classes.root}>
            <Field name="keyword" InputProps={{ notched: true }}>
              {({ field }: FieldProps) => (
                <InputBase
                  className={classes.input}
                  placeholder={t("searchFile")}
                  value={field.value ? decodeURI(field.value) : ""}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                    setFieldValue("keyword", event.target.value);
                    setSubmitType("search");
                    handleIntervalSearch(submitForm);
                  }}
                  autoFocus
                />
              )}
            </Field>
            {submitType === "search" && (
              <IconButton
                handleClick={submitForm}
                icon="search"
                className={classes.iconButton}
                fontSizeIcon="small"
              />
            )}
            {submitType === "clear" && (
              <IconButton
                handleClick={() => {
                  setFieldValue("keyword", "");
                  search("");
                }}
                icon="delete"
                className={classes.iconButton}
                fontSizeIcon="small"
              />
            )}
          </Paper>
        </Form>
      )}
    </Formik>
  );
}
