import axios from "axios";
import { initializeStore } from "@/store/index";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const talkInstance = (version = "v1") => {
  const { password, id: username } = initializeStore({}).getState().user.user;
  const api = axios.create({
    baseURL: `${publicRuntimeConfig.api.baseUrl}/ocs/v2.php/apps/spreed/api/${version}`,
    auth: {
      username,
      password,
    },
    headers: {
      "OCS-APIRequest": true,
    },
  });
  return api;
};

export default talkInstance;
