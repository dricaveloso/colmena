import axios from "axios";
import { initializeStore } from "@/store/index";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const shareInstance = (version = "v1") => {
  const { password, id: username } = initializeStore({}).getState().user.user;
  const api = axios.create({
    baseURL: `${publicRuntimeConfig.api.baseUrl}/ocs/v2.php/apps/files_sharing/api/${version}`,
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

export default shareInstance;
