import axios from "axios";
import { initializeStore } from "@/store/index";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const ocsInstance = () => {
  const { password, id: username } = initializeStore({}).getState().user.user;
  const api = axios.create({
    baseURL: `${publicRuntimeConfig.api.baseUrl}/ocs/v2.php/cloud`,
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
export default ocsInstance;
