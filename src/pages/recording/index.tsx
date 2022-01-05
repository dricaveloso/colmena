/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-indent */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import {
  AlignItemsEnum,
  JustifyContentEnum,
  EnvironmentEnum,
  DefaultAudioTypeEnum,
  DirectoryNamesNCEnum,
} from "@/enums/index";
import AudioRecorder from "@/components/pages/recording/AudioRecorder";
import DialogExtraInfoAudio from "@/components/pages/recording/DialogExtraInfoAudio";
import Timer from "@/components/pages/recording/Timer";
import Divider from "@/components/ui/Divider";
import { useSelector, useDispatch } from "react-redux";
import {
  PropsUserSelector,
  PropsAudioSave,
  PropsAudioData,
  SelectOptionItem,
  PropsConfigSelector,
  PropsLibrarySelector,
} from "@/types/index";
import { blobToArrayBuffer } from "blob-util";
import {
  createFile,
  updateFile as updateFileLocal,
  getFile as getFileLocal,
  remove as removeLocalFile,
} from "@/store/idb/models/files";
import { useRouter } from "next/router";
import { toast } from "@/utils/notifications";
import { updateRecordingState } from "@/store/actions/recordings/index";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import ActionConfirm from "@/components/ui/ActionConfirm";
import theme from "@/styles/theme";
import { convertPrivateToUsername, convertUsernameToPrivate } from "@/utils/directory";
import {
  putFile as putFileOnline,
  getFileId as getFileOnlineId,
  setDataFile,
} from "@/services/webdav/files";
import { assignTagFile, createAndAssignTagFile, listTags } from "@/services/webdav/tags";
import Backdrop from "@/components/ui/Backdrop";
import { SystemTagsInterface } from "@/interfaces/tags";
import { parseCookies } from "nookies";
import { removeSpecialCharacters } from "@/utils/utils";
import { createShare } from "@/services/share/share";
import { getUsersConversationsAxios, getSingleConversationAxios } from "@/services/talk/room";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["recording", "library"])),
  },
});

function Recording() {
  const { t } = useTranslation("recording");
  const { t: c } = useTranslation("common");
  const router = useRouter();
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [openDialogAudioName, setOpenDialogAudioName] = useState(false);
  const [openContinueRecording, setOpenContinueRecording] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [audioId, setAudioId] = useState();
  const [filename, setFilename] = useState("");
  const [amountAudiosRecorded, setAmountAudiosRecorded] = useState(0);
  const cookies = parseCookies();
  const language = cookies.NEXT_LOCALE || "en";
  const configRdx = useSelector((state: { config: PropsConfigSelector }) => state.config);
  const libraryRdx = useSelector((state: { library: PropsLibrarySelector }) => state.library);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateRecordingState({ activeRecordingState: "NONE" }));
  }, []);

  const handleCloseExtraInfo = () => {
    toast(t("audioSavedSuccessfully"), "success");
    setOpenDialogAudioName(false);
    dispatch(updateRecordingState({ activeRecordingState: "NONE" }));
  };

  const saveAudioHandle = async (values: PropsAudioSave) => {
    const { name: title, tags, path, availableOffline } = values;
    const defaultAudioType = DefaultAudioTypeEnum.type;
    try {
      const filename = `${convertUsernameToPrivate(
        path,
        userRdx.user.id,
      )}/${removeSpecialCharacters(title)}.${defaultAudioType}`;
      const aliasFilename = `${convertPrivateToUsername(
        path,
        userRdx.user.id,
      )}/${title}.${defaultAudioType}`;
      const basename = `${convertUsernameToPrivate(
        path,
        userRdx.user.id,
      )}/${removeSpecialCharacters(title)}.${defaultAudioType}`;
      const pathVer = convertUsernameToPrivate(path, userRdx.user.id);

      const recording = {
        title,
        tags,
        path,
        filename,
        basename,
        aliasFilename,
        environment: EnvironmentEnum.LOCAL,
      };
      await updateFileLocal(audioId, recording);
      const localFile = await getFileLocal(audioId);

      try {
        setOpenDialogAudioName(false);
        setShowBackdrop(true);

        if (navigator.onLine) {
          const tokenChat = await findTokenChatByPath(pathVer);
          let talkDir = "";
          if (tokenChat && typeof tokenChat === "string") {
            const canDelete = await verifyDeleteAccessFromUserOnChat(tokenChat);
            if (!canDelete) {
              talkDir = `${DirectoryNamesNCEnum.TALK}/`;
            }
          }
          const filenameWithTalkDir = `${talkDir}${filename}`;

          await putFileOnline(userRdx.user.id, `${filenameWithTalkDir}`, localFile.arrayBufferBlob);
          const fileId = await getFileOnlineId(userRdx.user.id, `${filenameWithTalkDir}`);

          await setDataFile(
            { customtitle: title, language },
            `${talkDir}${path}/${title}.${defaultAudioType}`,
          );

          const res = await listTags();
          const optionsTag: SelectOptionItem[] = res
            .filter((_, idx) => idx !== 0)
            .map((item: any | SystemTagsInterface) => ({
              id: item.propstat.prop.id,
              value: item.propstat.prop["display-name"].toLowerCase(),
            }));

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

          if (!availableOffline) {
            await removeLocalFile(audioId, userRdx.user.id);
          } else {
            await updateFileLocal(audioId, {
              filename: filenameWithTalkDir,
              environment: EnvironmentEnum.BOTH,
            });
          }

          await updateFileLocal(audioId, { nextcloudId: fileId });
          await createChatMessageFileNotification(filenameWithTalkDir, tokenChat);
        }
      } catch (e) {
        console.log("opa", e);
        toast(c("genericErrorMessage"), "error");
      } finally {
        setShowBackdrop(false);
      }
      setFilename(btoa(filename));
      setAmountAudiosRecorded((amountAudiosRecorded) => amountAudiosRecorded + 1);
      setOpenContinueRecording(true);
    } catch (e) {
      console.log("opa2", e);
      toast(t("errorStorageMessage"), "error");
    } finally {
      setOpenDialogAudioName(false);
    }
  };

  const keepRecordingHandle = () => {
    toast(t("audioSavedSuccessfully"), "success");
    setOpenDialogAudioName(false);
    setOpenContinueRecording(false);
  };

  async function findTokenChatByPath(path: string): Promise<string | boolean> {
    const arr = path.split("/");
    const tokenName = arr[0];
    const response = await getUsersConversationsAxios();
    const rooms = response.data.ocs.data;
    const token = rooms.find((item) => item.name === tokenName)?.token;

    if (!token) return false;

    return token;
  }

  async function verifyDeleteAccessFromUserOnChat(token: string): Promise<boolean> {
    const response = await getSingleConversationAxios(token);
    const { data } = response.data.ocs;

    return data.canDeleteConversation;
  }

  async function createChatMessageFileNotification(path: string, token: boolean | string) {
    if (!token || typeof token !== "string") return;

    try {
      await createShare(token, path);
      return;
    } catch (e) {
      console.log("aqui 2", e);
    }
  }

  const finishRecordingHandle = async () => {
    setOpenDialogAudioName(false);
    setOpenContinueRecording(false);
    toast(t("audioSavedSuccessfully"), "success");

    const urlBack = redirectToLastAccessedPage();
    if (amountAudiosRecorded === 1) {
      if (urlBack) router.push(urlBack);
      else router.push(`/file/${filename}`);
    } else if (amountAudiosRecorded > 1) {
      if (urlBack) router.push(urlBack);
    }
  };

  function redirectToLastAccessedPage(): string | null {
    const urlOrigin = configRdx.lastTwoPagesAccessed[1];

    if (/^[/]library/.test(urlOrigin)) {
      if ((urlOrigin.match(/[/]/g) || []).length > 1) {
        const path = libraryRdx.currentPath;
        return convertPrivateToUsername(path, userRdx.user.id).replace(/[/]library[/]/, "");
      }
    }

    if (/^[/]honeycomb/.test(urlOrigin)) {
      const url_ = urlOrigin.split("/");
      if (url_.length > 4) {
        return urlOrigin;
      }
    }

    return null;
  }

  async function firstSaveAudioHandle(audioData: PropsAudioData) {
    const { blob } = audioData;
    const arrayBufferBlob = await blobToArrayBuffer(blob);
    const title = new Date().toISOString();
    const recording = {
      title,
      arrayBufferBlob,
      type: blob?.type,
      size: blob?.size,
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
