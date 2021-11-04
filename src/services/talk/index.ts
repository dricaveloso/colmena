import axios from "axios";
import { initializeStore } from "@/store/index";

const talkInstance = (version = "v1") => {
  const { password, email: username } = initializeStore({}).getState().user.user;
  const api = axios.create({
<<<<<<< HEAD
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/ocs/v2.php/apps/spreed/api/v4`,
=======
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/ocs/v2.php/apps/spreed/api/${version}`,
    auth: {
      username,
      password,
    },
>>>>>>> 4386c950619279e0d1e8eb078ba4a2928f881e27
    headers: {
      "OCS-APIRequest": true,
    },
  });
  return api;
};

export default talkInstance;
