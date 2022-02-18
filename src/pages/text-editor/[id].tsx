/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import LayoutApp from "@/components/statefull/LayoutApp";
import Button from "@/components/ui/Button";
import { JustifyContentEnum, ButtonColorEnum, ButtonVariantEnum } from "@/enums/*";
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
import { getFileContents, putFile } from "@/services/webdav/files";
import { toast } from "@/utils/notifications";

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

  const { t: c } = useTranslation("common");
  const { t: l } = useTranslation("library");
  const router = useRouter();
  const { id } = router.query;
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const filename = `private/${id}.md`;

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
      const bufferValue = await result.data;
      newData = bufferValue;
      const buffer = Buffer.from(newData, "utf8");
      setContent(buffer.toString());
    } catch (error) {
      console.log(error);
      toast(c("genericErrorMessage"), "error");
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
