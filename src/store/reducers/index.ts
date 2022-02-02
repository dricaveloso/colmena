import { combineReducers } from "redux";
import userReducer from "./users";
import recordingReducer from "./recordings";
import configReducer from "./config";
import libraryReducer from "./library";
import honeycombReducer from "./honeycomb";

const appReducer = combineReducers({
  user: userReducer,
  recording: recordingReducer,
  config: configReducer,
  library: libraryReducer,
  honeycomb: honeycombReducer,
});

const rootReducer = (state: any, action: any) => {
  // when a logout action is dispatched it will reset redux state
  if (action.type === "USER_LOGGED_OUT") {
    localStorage.removeItem("persist:rootv2");
    // eslint-disable-next-line no-param-reassign
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
