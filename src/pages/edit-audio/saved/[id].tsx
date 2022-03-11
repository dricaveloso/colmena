/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useState } from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { GetStaticProps, GetStaticPaths } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum } from "@/enums/index";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import { toast } from "@/utils/notifications";
import { findByBasename as findByBasenameQuickBlob } from "@/store/idb/models/filesQuickBlob";
import { findByBasename } from "@/store/idb/models/files";
import { removeSpecialCharacters } from "@/utils/utils";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Backdrop from "@/components/ui/Backdrop";
import { putFile as putFileOnline } from "@/services/webdav/files";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme: Theme) => ({
  frameWaveform: {
    width: "100%",
    "& .device-orientation-edit-audio": {
      width: "100%",
      backgroundColor: theme.palette.variation7.dark,
    },
  },
  flexboxWrapper: {
    padding: "0 !important",
    margin: "0 !important",
    backgroundColor: theme.palette.variation7.dark,
  },
}));

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["editAudio", "common"])),
  },
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

function SavedAudio() {
  const classes = useStyles();
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const router = useRouter();
  const { id } = router.query;
  const filename = atob(String(id));

  const { t } = useTranslation("editAudio");
  const { t: c } = useTranslation("common");
  const [loading, setLoading] = useState(false);

  const init = async () => {
    try {
      setLoading(true);
      const localFile = await findByBasename(userRdx.user.id, removeSpecialCharacters(filename));
      const localFileQuickBlob = await findByBasenameQuickBlob(
        userRdx.user.id,
        removeSpecialCharacters(filename),
      );
      if (!localFile && !localFileQuickBlob) {
        toast(c("genericErrorMessage"), "error");
      } else {
        const blob = localFile?.arrayBufferBlob || localFileQuickBlob?.arrayBufferBlob;
        await putFileOnline(userRdx.user.id, filename, blob);
        toast(t("audioSavedTitle"), "success");
      }
    } catch (e) {
      console.log(e);
      toast(c("genericErrorMessage"), "error");
    } finally {
      setLoading(false);
      router.back();
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <LayoutApp
      templateHeader="variation3"
      showFooter={false}
      title={t("title")}
      subtitle={filename.split("/").reverse()[0]}
      back
      drawer={false}
    >
      <FlexBox justifyContent={JustifyContentEnum.CENTER} className={classes.flexboxWrapper}>
        <Box className={classes.frameWaveform}>
          <Backdrop open={loading} />
        </Box>
      </FlexBox>
    </LayoutApp>
  );
}

export default SavedAudio;
