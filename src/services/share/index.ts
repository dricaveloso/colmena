import axios from "axios";
import { initializeStore } from "@/store/index";

const shareInstance = (version = "v1") => {
  const { password, email: username } = initializeStore({}).getState().user.user;
  const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/ocs/v2.php/apps/files_sharing/api/${version}`,
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