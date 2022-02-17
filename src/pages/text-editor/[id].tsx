import React, { useState } from "react";
import dynamic from "next/dynamic";
import LayoutApp from "@/components/statefull/LayoutApp";
import Button from "@/components/ui/Button";
import { JustifyContentEnum, ButtonColorEnum, ButtonVariantEnum } from "@/enums/*";
import { I18nInterface } from "@/interfaces/index";
import "react-quill/dist/quill.snow.css";
import FlexBox from "@/components/ui/FlexBox";
import { Grid } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { GetStaticProps, GetStaticPaths } from "next";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const useStyles = makeStyles(() =>
  createStyles({
    gridContainer: {
      height: "70%",
    },
    editor: {
      width: "100%",
      height: "80%",
      borderRadius: "10px",
    },
    gridButton: {
      marginBottom: "20px",
    },
  }),
);

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["library", "common"])),
  },
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

const TextEditor = () => {
  const classes = useStyles();
  const [content] = useState<string>("");
  const { t: c } = useTranslation("common");

  // const onChange = (value: string) => {
  //   console.log(value);
  //   setContent(value);
  // };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote", "font"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["clean"],
    ],
  };

  return (
    <LayoutApp title="Editor">
      <FlexBox
        justifyContent={JustifyContentEnum.FLEXSTART}
        extraStyle={{
          marginBottom: "10px",
        }}
      >
        <Grid container className={classes.gridContainer}>
          <ReactQuill
            className={classes.editor}
            theme="snow"
            defaultValue={content}
            modules={modules}
            onChange={(e) => console.log(e)}
            preserveWhitespace
          />
        </Grid>
        <Grid container justifyContent="flex-end" className={classes.gridButton}>
          <Button
            variant={ButtonVariantEnum.CONTAINED}
            color={ButtonColorEnum.PRIMARY}
            title={c("saveButton")}
          />
        </Grid>
      </FlexBox>
    </LayoutApp>
  );
};

export default TextEditor;
