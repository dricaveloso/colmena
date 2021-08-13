import React, { useState } from "react";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import Timer from "@/components/pages/call/Timer";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Divider from "@/components/ui/Divider";
import { useDispatch, useSelector } from "react-redux";
import { recordingCreate } from "@/store/actions/recordings/index";
import { RecordingInterface } from "@/interfaces/index";
import { PropsUserSelector, PropsAudioSave } from "@/types/index";
import DialogExtraInfoAudio from "@/components/pages/recording/DialogExtraInfoAudio";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import { blobToBase64String } from "blob-util";

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
  const dispatch = useDispatch();
  const [recordState, setRecordState] = useState(null);
  const router = useRouter();

  const start = () => {
    setRecordState(RecordState.START);
  };

  const stop = () => {
    setRecordState(RecordState.STOP);
  };

  const onStop = (audioData: AudioDataProps) => {
    setAudioData(audioData);
    setOpenDialogAudioName(true);
  };

  const handleAudioSave = async (values: PropsAudioSave) => {
    const { name: title, tags } = values;
    if (audioData) {
      const { blob, type: audioType } = audioData;
      const id = uuid();
      const blobBase64 = await blobToBase64String(blob);
      const recording: RecordingInterface = {
        title,
        blobBase64,
        audioType,
        tags,
        createdAt: new Date(),
        userId: userRdx.user.id,
        id,
      };
      dispatch(recordingCreate(recording));
      router.push("/recording-done");
    }
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
      <Timer handleStart={start} handleStop={stop} />
      <DialogExtraInfoAudio
        open={openDialogAudioName}
        handleClose={() => setOpenDialogAudioName(false)}
        handleSubmit={handleAudioSave}
      />
    </div>
  );
}
