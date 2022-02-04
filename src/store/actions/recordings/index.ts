import {
  RECORDING_INSERT,
  RECORDING_UPDATE,
  CLEAR_RECORDINGS,
  SET_ACTIVE_RECORDING_STATE,
  SET_ALLOW_BROWSER_RECORDING,
  SET_PLAYING_AUDIO_PREVIEW,
} from "@/store/actions/index";
import { RecordingInterface } from "@/interfaces/index";

export const recordingCreate = (recording: RecordingInterface) => ({
  type: RECORDING_INSERT,
  recording,
});

export const recordingUpdate = (id: string, recording: RecordingInterface) => ({
  type: RECORDING_UPDATE,
  id,
  recording,
});

export const updateRecordingState = (activeRecordingState: string) => ({
  type: SET_ACTIVE_RECORDING_STATE,
  activeRecordingState,
});

export const updatePlayingAudioPreview = (isPlayingAudioPreview: boolean) => ({
  type: SET_PLAYING_AUDIO_PREVIEW,
  isPlayingAudioPreview,
});

export const updatePermissionBrowserRecording = ({
  allowBrowserRecording,
}: {
  allowBrowserRecording: string;
}) => ({
  type: SET_ALLOW_BROWSER_RECORDING,
  allowBrowserRecording,
});

export const clearRecording = () => ({
  type: CLEAR_RECORDINGS,
});
