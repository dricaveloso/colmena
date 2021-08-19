import React, { useState, useContext } from "react";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import Timer from "@/components/pages/call/Timer";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Divider from "@/components/ui/Divider";
import { useSelector } from "react-redux";
import { PropsUserSelector, PropsAudioSave } from "@/types/index";
import DialogExtraInfoAudio from "@/components/pages/recording/DialogExtraInfoAudio";
import { useRouter } from "next/router";
import { blobToArrayBuffer } from "blob-util";
import { createAudio } from "@/store/idb/models/audios";
import NotificationContext from "@/store/context/notification-context";
import { NotificationStatusEnum } from "@/enums/*";

type AudioDataProps = {
  blob: any;
  url?: string;
  type: string;
};

export default function RecorderAux() {
  const theme = useTheme();
  const matchXs = useMediaQuery(theme.breakpoints.down("sm"));
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [audioData, setAudioData] = useState<AudioDataProps | undefined>();
  const [openDialogAudioName, setOpenDialogAudioName] = useState(false);
  const [recordState, setRecordState] = useState(null);
  const [showTimer, setShowtimer] = useState(true);
  const notificationCtx = useContext(NotificationContext);
  const router = useRouter();

  const start = () => {
    setRecordState(RecordState.START);
  };

  const stop = () => {
    setRecordState(RecordState.STOP);
  };

  const onStop = (audioData: AudioDataProps) => {
    setShowtimer(false);
    setAudioData(audioData);
    setOpenDialogAudioName(true);
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
        router.push("/recording-done");
        setShowtimer(true);
      }
    } catch (e) {
      console.log(e);
      notificationCtx.showNotification({
        message: "Não foi possível armazenar sua gravação",
        status: NotificationStatusEnum.ERROR,
      });
    } finally {
      setOpenDialogAudioName(false);
    }
  };

  const handleCloseExtraInfo = () => {
    setShowtimer(true);
    setOpenDialogAudioName(false);
  };

  return (
    <div>
      <AudioReactRecorder
        backgroundColor="rgb(255,255,255)"
        canvasHeight={matchXs ? 280 : 380}
        canvasWidth={matchXs ? 400 : 600}
        state={recordState}
        onStop={onStop}
      />
      <Divider marginBottom={25} />
      {showTimer && <Timer handleStart={start} handleStop={stop} />}
      <DialogExtraInfoAudio
        open={openDialogAudioName}
        handleClose={handleCloseExtraInfo}
        handleSubmit={handleAudioSave}
      />
    </div>
  );
}
