import { RECORDING_INSERT, RECORDING_UPDATE, CLEAR_RECORDINGS } from "@/store/actions/index";
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

export const clearRecording = () => ({
  type: CLEAR_RECORDINGS,
});
