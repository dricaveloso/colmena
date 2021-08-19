/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect } from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface, RecordingInterface } from "@/interfaces/index";
import { JustifyContentEnum, TextVariantEnum } from "@/enums/index";
import { useSelector } from "react-redux";
import Text from "@/components/ui/Text";
import Chip from "@material-ui/core/Chip";
import RecordingDoneOptions from "@/components/pages/recording/RecordingDoneOptions";
import { v4 as uuid } from "uuid";
import { arrayBufferToBlob, createObjectURL } from "blob-util";
import { getLastAudioRecordedByUser } from "@/store/idb/models/audios";
import { PropsUserSelector } from "@/types/index";
import CenterProgress from "@/components/ui/CenterProgress";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["recordingDone", "drawer", "common"])),
  },
});

function RecordingDone() {
  const { t } = useTranslation("recordingDone");
  const [audio, setAudio] = useState<RecordingInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const result = await getLastAudioRecordedByUser(userRdx.user.id);
        const resultObj = result[0];
        const blob = arrayBufferToBlob(resultObj.arrayBufferBlob);
        const audioUrl = createObjectURL(blob);
        const resultNew = {
          audioUrl,
          ...resultObj,
        };
        setAudio(resultNew);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [userRdx]);

  if (loading) return <CenterProgress />;

  if (!audio) return router.push("/recording");

  return (
    <LayoutApp title={t("title")}>
      <FlexBox justifyContent={JustifyContentEnum.CENTER}>
        <RecordingDoneOptions />
        <div>
          <Text style={{ marginBottom: 10 }} variant={TextVariantEnum.SUBTITLE1}>
            {audio?.title}
          </Text>
          <audio id="audio" controls src={audio?.audioUrl}></audio>
          <Text style={{ margintop: 10, marginBottom: 10 }} variant={TextVariantEnum.SUBTITLE2}>
            {t("tagsTitle")}
          </Text>
          {audio &&
            audio?.tags.map((item) => (
              <Chip key={uuid()} label={item.title} style={{ marginRight: 5 }} />
            ))}
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default RecordingDone;
