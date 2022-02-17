/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { getFileContents, putFile } from "@/services/webdav/files";
import { toast } from "@/utils/notifications";

const ReactQuill = dynamic(() => import("react-quill"));

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
  const [content, setContent] = useState<any>();

  const { t: c } = useTranslation("common");
  const { t: l } = useTranslation("library");
  const router = useRouter();
  const { id } = router.query;
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const filename = `private/${id}.md`;

  const onChange = (content: string) => {
    setContent(content);
  };

  const updateText = async () => {
    try {
      await putFile(userRdx.user.id, filename, content, {
        username: userRdx.user.id,
        password: userRdx.user.password,
      });
      toast(c("messages.fileSaveSuccessfully"), "success");
    } catch (error) {
      toast(c("genericErrorMessage"), "error");
      console.log(error);
    }
  };

  const getContent = async () => getFileContents(userRdx.user.id, filename);
  const setInitialData = async () => {
    let newData;

    try {
      const result: any = await getContent();
      const teste = await result.data;
      newData = teste;
    } catch (error) {
      console.log(error);
    } finally {
      const buffer = Buffer.from(newData, "utf8");
      setContent(buffer.toString());
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setInitialData();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote", "font"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["clean"],
    ],
  };

  return (
    <LayoutApp title={c("textEditor")}>
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
            value={content}
            modules={modules}
            onChange={(content) => onChange(content)}
          />
        </Grid>
        <Grid container justifyContent="flex-end" className={classes.gridButton}>
          <Button
            variant={ButtonVariantEnum.CONTAINED}
            color={ButtonColorEnum.PRIMARY}
            title={l("saveButton")}
            handleClick={() => updateText()}
          />
        </Grid>
      </FlexBox>
    </LayoutApp>
  );
};

export default TextEditor;
