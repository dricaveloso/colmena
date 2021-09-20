import axios from "axios";
import { initializeStore } from "@/store/index";

const ocs = () => {
  const { userToken } = initializeStore({}).getState().user.user;
  const api = axios.create({
    baseURL: `https://cors-anywhere.herokuapp.com/https://claudio.colmena.network/ocs/v2.php/cloud`,
    headers: {
      "OCS-APIRequest": true,
      Authorization: `Bearer ${userToken}`,
    },
  });
  return api;
};
export default ocs;
