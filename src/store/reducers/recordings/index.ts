import { RECORDING_INSERT, RECORDING_UPDATE, CLEAR_RECORDINGS } from "@/store/actions/index";
import { RecordingInterface } from "@/interfaces/index";

type initialStateProps = {
  recordings: RecordingInterface[];
};

const initialState: initialStateProps = {
  recordings: [],
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case RECORDING_INSERT:
      return { ...state, recordings: state.recordings.concat(action.recording) };
    case CLEAR_RECORDINGS:
      return { ...state, recordings: [] };
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
