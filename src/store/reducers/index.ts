import { combineReducers } from "redux";
import userReducer from "./users";
import recordingReducer from "./recordings";

export default combineReducers({
  user: userReducer,
  recording: recordingReducer,
});
