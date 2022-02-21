/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import LayoutApp from "@/components/statefull/LayoutApp";
import Button from "@/components/ui/Button";
import { JustifyContentEnum, ButtonVariantEnum } from "@/enums/*";
import { I18nInterface } from "@/interfaces/index";
import FlexBox from "@/components/ui/FlexBox";
import { Grid } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { GetStaticProps, GetStaticPaths } from "next";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { existFile, getFileContents, putFile } from "@/services/webdav/files";
import { toast } from "@/utils/notifications";
import { getAccessedPages } from "@/utils/utils";

const importJodit = () => import("jodit-react");
const JoditEditor = dynamic(importJodit, {
  ssr: false,
});

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
      marginTop: "20px",
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
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastPath, setLastPath] = useState<string>("");
  const { t: c } = useTranslation("common");
  const { t: l } = useTranslation("library");
  const router = useRouter();
  const { id } = router.query;
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const filename = `private/${id}.md`;

  const createFileText = async () => {
    const finalFilename = `private/${id}.md`;
    try {
      await putFile(userRdx.user.id, finalFilename, content);
    } catch (error) {
      toast(error.message, "error");
    }
  };

  const save = async () => {
    try {
      setIsLoading(true);
      await createFileText();
      await putFile(userRdx.user.id, filename, content);
      toast(c("messages.fileSaveSuccessfully"), "success");
    } catch (error) {
      toast(c("genericErrorMessage"), "error");
      console.log(error);
    } finally {
      setIsLoading(false);
      router.push(lastPath);
    }
  };

  const getContent = async () => getFileContents(userRdx.user.id, filename);

  const setInitialData = async () => {
    const exists = await existFile(userRdx.user.id, `private/${id}.md`);
    if (exists) {
      let newData;
      try {
        const result: any = await getContent();
        const bufferValue = await result.data;
        newData = bufferValue;
        const buffer = Buffer.from(newData, "utf8");
        setContent(buffer.toString());
      } catch (error) {
        console.log(error);
        toast(c("genericErrorMessage"), "error");
      }
    } else {
      setContent("");
    }
  };

  const getLastPath = async () => {
    const accessedPages = await getAccessedPages();
    setLastPath(accessedPages[1]);
  };

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setInitialData();
      getLastPath();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <LayoutApp title={c("textEditor")}>
      <FlexBox
        justifyContent={JustifyContentEnum.FLEXSTART}
        extraStyle={{
          marginBottom: "10px",
        }}
      >
        <Grid container className={classes.gridContainer}>
          <JoditEditor
            value={content}
            config={{
              readonly: false,
            }}
            onBlur={(newContent) => setContent(newContent)}
          />
        </Grid>
        <Grid container justifyContent="space-between" className={classes.gridButton}>
          <Button
            variant={ButtonVariantEnum.OUTLINED}
            title={l("cancel")}
            handleClick={() => router.back()}
          />
          <Button
            variant={ButtonVariantEnum.CONTAINED}
            title={l("saveButton")}
            handleClick={() => save()}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </Grid>
      </FlexBox>
    </LayoutApp>
  );
};

export default TextEditor;
