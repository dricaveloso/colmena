import { combineReducers } from "redux";
import userReducer from "./users";
import recordingReducer from "./recordings";
import configReducer from "./config";

export default combineReducers({
  user: userReducer,
  recording: recordingReducer,
  config: configReducer,
});
