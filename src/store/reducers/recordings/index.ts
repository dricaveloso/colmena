import { RecordingInterface } from "@/interfaces/index";
import {
  RECORDING_INSERT,
  RECORDING_UPDATE,
  CLEAR_RECORDINGS,
  SET_ACTIVE_RECORDING_STATE,
  SET_ALLOW_BROWSER_RECORDING,
} from "@/store/actions/index";

type initialStateProps = {
  recordings: RecordingInterface[];
  activeRecordingState: string;
  allowBrowserRecording: boolean;
};

const initialState: initialStateProps = {
  recordings: [],
  activeRecordingState: "NONE",
  allowBrowserRecording: false,
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case RECORDING_INSERT:
      return { ...state, recordings: state.recordings.concat(action.recording) };
    case CLEAR_RECORDINGS:
      return { ...state, recordings: [] };
    case SET_ACTIVE_RECORDING_STATE:
      return { ...state, activeRecordingState: action.activeRecordingState };
    case SET_ALLOW_BROWSER_RECORDING:
      return { ...state, allowBrowserRecording: action.allowBrowserRecording };
    case RECORDING_UPDATE:
      // eslint-disable-next-line no-case-declarations
      const newRecordings = state.recordings;
      newRecordings.map((item: RecordingInterface) => {
        if (item.id === action.id) {
          // eslint-disable-next-line no-param-reassign
          item = action.recording;
        }
        return item;
      });
      return { ...state, recordings: newRecordings };
    default:
      return state;
  }
};

export default reducer;
