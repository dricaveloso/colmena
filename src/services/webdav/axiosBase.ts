/* eslint-disable @typescript-eslint/ban-types */
import axios from "axios";
import { initializeStore } from "@/store/index";
import getConfig from "next/config";
import { RequestDataPayload } from "webdav";
import { encodeURLAxios } from "@/utils/utils";

const { publicRuntimeConfig } = getConfig();

export default async function axiosBase(
  data: RequestDataPayload | null | {},
  path: string,
  method = "PROPFIND",
  extraHeaders: {} = { "Content-Type": "application/xml; charset=utf-8" },
) {
  const { password, id: username } = initializeStore({}).getState().user.user;
  let baseUrl = `${publicRuntimeConfig.api.baseUrl}`;
  if (path.search(/^apps\/colmenappi/) < 0) {
    baseUrl += "/remote.php";
  }

  const config: any = {
    method,
    url: `${baseUrl}/${encodeURLAxios(path)}`,
    headers: {
      ...extraHeaders,
    },
    auth: {
      username,
      password,
    },
    data,
  };

  return axios(config);
}
