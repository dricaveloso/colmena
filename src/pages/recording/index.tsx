/* eslint-disable no-underscore-dangle */
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
import { PropsUserSelector, PropsAudioSave, PropsAudioData, SelectOptionItem } from "@/types/index";
import { blobToArrayBuffer } from "blob-util";
import {
  createFile,
  updateFile as updateFileLocal,
  getFile as getFileLocal,
} from "@/store/idb/models/files";
// import { useRouter } from "next/router";
import NotificationContext from "@/store/context/notification-context";
import { updateRecordingState } from "@/store/actions/recordings/index";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import ActionConfirm from "@/components/ui/ActionConfirm";
import theme from "@/styles/theme";
import { convertUsernameToPrivate } from "@/utils/directory";
import { putFile as putFileOnline, getFileId as getFileOnlineId } from "@/services/webdav/files";
import { assignTagFile, createAndAssignTagFile, listTags } from "@/services/webdav/tags";
import { SystemTagsInterface } from "@/interfaces/tags";
import Backdrop from "@/components/ui/Backdrop";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["recording", "library"])),
  },
});

function Recording() {
  const { t } = useTranslation("recording");
  // const router = useRouter();
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [openDialogAudioName, setOpenDialogAudioName] = useState(false);
  const [openContinueRecording, setOpenContinueRecording] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [audioId, setAudioId] = useState();
  // const [amountAudiosRecorded, setAmountAudiosRecorded] = useState(0);
  const [optionsTag, setOptionsTag] = useState<SelectOptionItem[]>([]);
  const notificationCtx = useContext(NotificationContext);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateRecordingState({ activeRecordingState: "NONE" }));
    (async () => {
      const res = await listTags();
      const tags: SelectOptionItem[] = res
        .filter((_, idx) => idx !== 0)
        .map((item: any | SystemTagsInterface) => ({
          id: item.propstat.prop.id,
          value: item.propstat.prop["display-name"].toLowerCase(),
        }));
      setOptionsTag(tags);
    })();
  }, []);

  const handleCloseExtraInfo = () => {
    notificationCtx.showNotification({
      message: t("audioSavedSuccessfully"),
      status: NotificationStatusEnum.SUCCESS,
    });
    setOpenDialogAudioName(false);
    dispatch(updateRecordingState({ activeRecordingState: "NONE" }));
  };

  const saveAudioHandle = async (values: PropsAudioSave) => {
    const { name: title, tags, path } = values;
    try {
      const recording = {
        title,
        tags,
        path,
      };
      await updateFileLocal(audioId, recording);
      const localFile = await getFileLocal(audioId);

      try {
        setOpenDialogAudioName(false);
        setShowBackdrop(true);
        const filePath = `${convertUsernameToPrivate(path, userRdx.user.id)}/${title}.opus`;
        await putFileOnline(userRdx.user.id, filePath, localFile.arrayBufferBlob);
        const fileId = await getFileOnlineId(userRdx.user.id, filePath);

        const tagsFoundOnline = optionsTag
          .filter((item) => tags.includes(item.value))
          .map((item) => item.id);

        const tagsOnlineValues = optionsTag.map((item) => item.value);
        const tagsNotFoundOnline = tags.filter((item) => !tagsOnlineValues.includes(item));

        tagsFoundOnline.forEach(async (item: number) => {
          await assignTagFile(Number(fileId), item);
        });

        tagsNotFoundOnline.forEach(async (item: string) => {
          await createAndAssignTagFile(Number(fileId), item);
        });

        await updateFileLocal(audioId, { nextcloudId: fileId });
      } catch (e) {
        console.log("Nao uploadeou online", e);
      } finally {
        setShowBackdrop(false);
      }

      // setAmountAudiosRecorded((amountAudiosRecorded) => amountAudiosRecorded + 1);
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
    setOpenDialogAudioName(false);
    setOpenContinueRecording(false);
    // router.push(
    //   amountAudiosRecorded === 1 ? "/recording-done" : `/library/${userRdx.user.id}/audios`,
    // );
  };

  async function firstSaveAudioHandle(audioData: PropsAudioData) {
    const { blob, type: audioType } = audioData;
    const arrayBufferBlob = await blobToArrayBuffer(blob);
    const title = new Date().toISOString();
    const recording = {
      title,
      arrayBufferBlob,
      audioType,
      createdAt: new Date(),
      userId: userRdx.user.id,
    };
    const audioId = await createFile(recording);
    setAudioId(audioId);
    dispatch(updateRecordingState({ activeRecordingState: "NONE" }));
  }

  async function onStopRecording(audioData: PropsAudioData) {
    await firstSaveAudioHandle(audioData);
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
            handleSubmit={saveAudioHandle}
            optionsTag={optionsTag}
          />
        )}
        <Backdrop open={showBackdrop} />
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
