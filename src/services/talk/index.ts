import axios from "axios";
import { initializeStore } from "@/store/index";

const talk = () => {
  const { userToken } = initializeStore({}).getState().user.user;
  const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/ocs/v2.php/apps/spreed/api/v4`,
    headers: {
      "OCS-APIRequest": true,
      Authorization: `Bearer ${userToken}`,
    },
  });
  return api;
};
export default talk;
