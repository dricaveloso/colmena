import { combineReducers } from "redux";
import userReducer from "./users";
import recordingReducer from "./recordings";
import configReducer from "./config";
import libraryReducer from "./library";

export default combineReducers({
  user: userReducer,
  recording: recordingReducer,
  config: configReducer,
  library: libraryReducer,
});
