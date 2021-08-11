/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import FlexBox from "@/components/ui/FlexBox";
// import IconButton from "@/components/ui/IconButton";
import Divider from "@/components/ui/Divider";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps, GetStaticPaths } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum, TextVariantEnum } from "@/enums/index";
import { useSelector } from "react-redux";
import { PropsRecordingSelector } from "@/types/index";
import Text from "@/components/ui/Text";
import Chip from "@material-ui/core/Chip";
import RecordingDoneOptions from "@/components/pages/recording/RecordingDoneOptions";
import { v4 as uuid } from "uuid";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["recordDone", "drawer", "common"])),
  },
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

function RecordingDone() {
  const router = useRouter();
  const { id } = router.query;
  const recordingRdx = useSelector(
    (state: { recording: PropsRecordingSelector }) => state.recording,
  );
  const recording = recordingRdx.recordings.find((item) => item.id === id);
  const { t } = useTranslation("recordDone");

  // const navigate = (url: string) => {
  //   router.push(url);
  // };

  return (
    <LayoutApp title={t("title")}>
      <FlexBox justifyContent={JustifyContentEnum.CENTER}>
        <RecordingDoneOptions />
        <div>
          <Text variant={TextVariantEnum.SUBTITLE1}>{recording?.title}</Text>
          <Divider marginBottom={10} marginTop={0} />
          <audio id="audio" controls src={recording?.url}></audio>
          <Divider marginBottom={10} marginTop={0} />
          <Text variant={TextVariantEnum.SUBTITLE2}>Tags</Text>
          <Divider marginBottom={10} marginTop={0} />
          {recording?.tags.map((item) => (
            <Chip key={uuid()} label={item.title} style={{ marginRight: 5 }} />
          ))}
          {/* <Divider marginBottom={20} />
          <IconButton
            title={t("textEditButton")}
            icon="edit"
            variantTitle={TextVariantEnum.BODY2}
            fontSizeIcon="large"
            handleClick={() => navigate("/edit-audio")}
          />
          <Divider marginBottom={20} />
          <IconButton
            title={t("textShareButton")}
            icon="share"
            variantTitle={TextVariantEnum.BODY2}
            fontSizeIcon="large"
            handleClick={() => navigate("/share-audio")}
          /> */}
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default RecordingDone;
