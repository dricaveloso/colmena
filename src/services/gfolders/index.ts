import axios from "axios";

import { initializeStore } from "@/store/index";

const gfoldersInstance = () => {
  const { password, id: username } = initializeStore({}).getState().user.user;
  const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}apps/groupfolders`,
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
export default gfoldersInstance;
