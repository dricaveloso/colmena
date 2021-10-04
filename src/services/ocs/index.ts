import axios from "axios";

import { initializeStore } from "@/store/index";

const ocs = () => {
  const { password, email: username } = initializeStore({}).getState().user.user;
  const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/ocs/v2.php/cloud`,
    auth: {
      username,
      password,
    },
    headers: {
      "OCS-APIRequest": true,
      // Authorization: `Bearer ${userToken}`,
    },
  });
  return api;
};
export default ocs;
