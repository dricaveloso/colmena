/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect, useCallback } from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import {
  AlignItemsEnum,
  JustifyContentEnum,
  NotificationStatusEnum,
  TextVariantEnum,
} from "@/enums/index";
import AudioRecorder from "@/components/pages/recording/AudioRecorder";
import DialogExtraInfoAudio from "@/components/pages/recording/DialogExtraInfoAudio";
import WhiteSpaceFooter from "@/components/ui/WhiteSpaceFooter";
import Timer from "@/components/pages/recording/Timer";
import Divider from "@/components/ui/Divider";
import { useSelector, useDispatch } from "react-redux";
import { PropsUserSelector, PropsAudioSave, PropsAudioData } from "@/types/index";
import { blobToArrayBuffer } from "blob-util";
import { createAudio, updateAudio } from "@/store/idb/models/audios";
import { useRouter } from "next/router";
import NotificationContext from "@/store/context/notification-context";
import { updateRecordingState } from "@/store/actions/recordings/index";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import Text from "@/components/ui/Text";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["recording"])),
  },
});

function Recording() {
  const { t } = useTranslation("recording");
  const router = useRouter();
  const [openDialogAudioName, setOpenDialogAudioName] = useState(true);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [audioId, setAudioId] = useState();
  const [audioTitleSaved, setAudioTitleSaved] = useState<Date | string>("");
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
      const recording = {
        title,
        tags,
      };
      await updateAudio(audioId, recording);
      setAudioTitleSaved(title);
      router.push("/recording-done");
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

  async function createAudioHandle(audioData: PropsAudioData) {
    const { blob, type: audioType } = audioData;
    const arrayBufferBlob = await blobToArrayBuffer(blob);
    const title = new Date().toISOString();
    setAudioTitleSaved(title);
    const recording = {
      title,
      arrayBufferBlob,
      audioType,
      tags: [],
      createdAt: new Date(),
      userId: userRdx.user.id,
    };
    const audioId = await createAudio(recording);
    setAudioId(audioId);
    dispatch(updateRecordingState({ activeRecordingState: "NONE" }));
  }

  async function onStopRecording(audioData: PropsAudioData) {
    await createAudioHandle(audioData);
    setOpenDialogAudioName(true);
  }

  const handleUpdateAudioTitle = useCallback(() => {
    setAudioTitleSaved("");
  }, []);

  return (
    <LayoutApp title={t("title")} back>
      <FlexBox justifyContent={JustifyContentEnum.CENTER} alignItems={AlignItemsEnum.CENTER}>
        {audioTitleSaved && (
          <Text variant={TextVariantEnum.BODY2}>
            {t("audioTitle")} <b>{audioTitleSaved}</b> {t("audioSaveTitle")}!
          </Text>
        )}
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <AudioRecorder onStopRecording={onStopRecording} />
        <Divider marginBottom={25} />
        <Timer handleUpdateAudioTitle={handleUpdateAudioTitle} />
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
