/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { AlignItemsEnum, JustifyContentEnum, NotificationStatusEnum } from "@/enums/index";
import AudioRecorder from "@/components/pages/recording/AudioRecorder";
import DialogExtraInfoAudio from "@/components/pages/recording/DialogExtraInfoAudio";
import WhiteSpaceFooter from "@/components/ui/WhiteSpaceFooter";
import Timer from "@/components/pages/recording/Timer";
import Divider from "@/components/ui/Divider";
import { useSelector, useDispatch } from "react-redux";
import { PropsUserSelector, PropsAudioSave, PropsAudioData } from "@/types/index";
import { blobToArrayBuffer } from "blob-util";
import { createAudio } from "@/store/idb/models/audios";
import { useRouter } from "next/router";
import NotificationContext from "@/store/context/notification-context";
import { updateRecordingState } from "@/store/actions/recordings/index";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["recording", "drawer", "common"])),
  },
});

function Recording() {
  const { t } = useTranslation("recording");
  const router = useRouter();
  const [openDialogAudioName, setOpenDialogAudioName] = useState(false);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [audioData, setAudioData] = useState<PropsAudioData | undefined>();
  const notificationCtx = useContext(NotificationContext);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateRecordingState({ activeRecordingState: "NONE" }));
  }, []);

  const handleCloseExtraInfo = () => {
    setOpenDialogAudioName(false);
    dispatch(updateRecordingState({ activeRecordingState: "NONE" }));
  };

  const handleAudioSave = async (values: PropsAudioSave) => {
    const { name: title, tags } = values;
    try {
      if (audioData) {
        const { blob, type: audioType } = audioData;
        const arrayBufferBlob = await blobToArrayBuffer(blob);
        const recording = {
          title,
          arrayBufferBlob,
          audioType,
          tags,
          createdAt: new Date(),
          userId: userRdx.user.id,
        };
        await createAudio(recording);
        dispatch(updateRecordingState({ activeRecordingState: "NONE" }));
        router.push("/recording-done");
      }
    } catch (e) {
      console.log(e);
      notificationCtx.showNotification({
        message: t("errorStorageMessage"),
        status: NotificationStatusEnum.ERROR,
      });
    } finally {
      setOpenDialogAudioName(false);
    }
  };

  function onStopRecording(audioData: PropsAudioData) {
    setAudioData(audioData);
    setOpenDialogAudioName(true);
  }

  return (
    <LayoutApp title={t("title")} back>
      <FlexBox justifyContent={JustifyContentEnum.CENTER} alignItems={AlignItemsEnum.CENTER}>
        <AudioRecorder onStopRecording={onStopRecording} />
        <Divider marginBottom={25} />
        <Timer />
        <DialogExtraInfoAudio
          open={openDialogAudioName}
          handleClose={handleCloseExtraInfo}
          handleSubmit={handleAudioSave}
        />
        <WhiteSpaceFooter />
      </FlexBox>
    </LayoutApp>
  );
}

export default Recording;
