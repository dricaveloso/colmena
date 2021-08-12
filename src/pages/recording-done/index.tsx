/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum, TextVariantEnum } from "@/enums/index";
import { useSelector } from "react-redux";
import { PropsRecordingSelector } from "@/types/index";
import Text from "@/components/ui/Text";
import Chip from "@material-ui/core/Chip";
import RecordingDoneOptions from "@/components/pages/recording/RecordingDoneOptions";
import { v4 as uuid } from "uuid";
import { base64StringToBlob, createObjectURL } from "blob-util";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["recordingDone", "drawer", "common"])),
  },
});

function RecordingDone() {
  const { t } = useTranslation("recordingDone");
  const router = useRouter();
  const recordingRdx = useSelector(
    (state: { recording: PropsRecordingSelector }) => state.recording,
  );
  const recording = recordingRdx.recordings[recordingRdx.recordings.length - 1];

  if (!recording || !recording.blobBase64) router.replace("/recording");

  const blob = base64StringToBlob(recording?.blobBase64 || "");
  const audioUrl = createObjectURL(blob);

  return (
    <LayoutApp title={t("title")}>
      <FlexBox justifyContent={JustifyContentEnum.CENTER}>
        <RecordingDoneOptions />
        <div>
          <Text style={{ marginBottom: 10 }} variant={TextVariantEnum.SUBTITLE1}>
            {recording?.title}
          </Text>
          <audio id="audio" controls src={audioUrl}></audio>
          <Text style={{ margintop: 10, marginBottom: 10 }} variant={TextVariantEnum.SUBTITLE2}>
            {t("tagsTitle")}
          </Text>
          {recording?.tags.map((item) => (
            <Chip key={uuid()} label={item.title} style={{ marginRight: 5 }} />
          ))}
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default RecordingDone;
