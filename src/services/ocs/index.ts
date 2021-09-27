import axios from "axios";

import { initializeStore } from "@/store/index";

const ocs = () => {
  const { userToken } = initializeStore({}).getState().user.user;
  console.log(userToken);
  const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/ocs/v2.php/cloud`,
    // auth: {
    //   username: "nilson.f.rocha@gmail.com",
    //   password: "3aowM-TSook-GBtTn-GbAYP-weYkT",
    // },
    headers: {
      "OCS-APIRequest": true,
      Authorization: `Bearer ${userToken}`,
    },
  });
  return api;
};
export default ocs;
