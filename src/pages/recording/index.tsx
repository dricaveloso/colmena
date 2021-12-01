/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-indent */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { AlignItemsEnum, JustifyContentEnum, NotificationStatusEnum } from "@/enums/index";
import AudioRecorder from "@/components/pages/recording/AudioRecorder";
import DialogExtraInfoAudio from "@/components/pages/recording/DialogExtraInfoAudio";
import Timer from "@/components/pages/recording/Timer";
import Divider from "@/components/ui/Divider";
import { useSelector, useDispatch } from "react-redux";
import { PropsUserSelector, PropsAudioSave, PropsAudioData } from "@/types/index";
import { blobToArrayBuffer } from "blob-util";
import { createFile, updateFile } from "@/store/idb/models/files";
import { useRouter } from "next/router";
import NotificationContext from "@/store/context/notification-context";
import { updateRecordingState } from "@/store/actions/recordings/index";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import ActionConfirm from "@/components/ui/ActionConfirm";
import theme from "@/styles/theme";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["recording"])),
  },
});

function Recording() {
  const { t } = useTranslation("recording");
  const router = useRouter();
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [openDialogAudioName, setOpenDialogAudioName] = useState(false);
  const [openContinueRecording, setOpenContinueRecording] = useState(false);
  const [audioId, setAudioId] = useState();
  const [amountAudiosRecorded, setAmountAudiosRecorded] = useState(0);
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
      await updateFile(audioId, recording);
      setAmountAudiosRecorded((amountAudiosRecorded) => amountAudiosRecorded + 1);
      setOpenContinueRecording(true);
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

  const keepRecordingHandle = () => {
    notificationCtx.showNotification({
      message: t("audioSavedSuccessfully"),
      status: NotificationStatusEnum.SUCCESS,
    });
    setOpenDialogAudioName(false);
    setOpenContinueRecording(false);
  };

  const finishRecordingHandle = () => {
    router.push(
      amountAudiosRecorded === 1 ? "/recording-done" : `/library/${userRdx.user.id}/audios`,
    );
  };

  async function createAudioHandle(audioData: PropsAudioData) {
    const { blob, type: audioType } = audioData;
    const arrayBufferBlob = await blobToArrayBuffer(blob);
    const title = new Date().toISOString();
    const recording = {
      title,
      arrayBufferBlob,
      audioType,
      tags: [],
      createdAt: new Date(),
      userId: userRdx.user.id,
    };
    const audioId = await createFile(recording);
    setAudioId(audioId);
    dispatch(updateRecordingState({ activeRecordingState: "NONE" }));
  }

  async function onStopRecording(audioData: PropsAudioData) {
    await createAudioHandle(audioData);
    setOpenDialogAudioName(true);
  }

  return (
    <LayoutApp title={t("title")} showFooter={false} back>
      <FlexBox justifyContent={JustifyContentEnum.SPACEAROUND} alignItems={AlignItemsEnum.CENTER}>
        <AudioRecorder onStopRecording={onStopRecording} />
        <Divider marginTop={25} />
        <Timer />
        {openDialogAudioName && (
          <DialogExtraInfoAudio
            open={openDialogAudioName}
            handleClose={handleCloseExtraInfo}
            handleSubmit={handleAudioSave}
          />
        )}
      </FlexBox>
      {openContinueRecording && (
        <ActionConfirm
          title={t("audioConfirmationToKeep")}
          icon="info"
          iconColor={theme.palette.primary.dark}
          onOk={keepRecordingHandle}
          onClose={finishRecordingHandle}
        />
      )}
    </LayoutApp>
  );
}

export default Recording;
