import axios from "axios";
import { initializeStore } from "@/store/index";

const talk = () => {
  const { userToken } = initializeStore({}).getState().user.user;
  const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/ocs/v1.php/cloud`,
    headers: {
      "OCS-APIRequest": true,
      Authorization: `Bearer ${userToken}`,
    },
  });
  return api;
};
export default talk;
