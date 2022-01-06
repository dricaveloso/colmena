/* eslint-disable @typescript-eslint/ban-types */
import axios from "axios";
import { initializeStore } from "@/store/index";
import getConfig from "next/config";
import { RequestDataPayload } from "webdav";
import { removeCornerSlash } from "@/utils/utils";

const { publicRuntimeConfig } = getConfig();

export default async function axiosBase(
  data: RequestDataPayload | null | {},
  path?: string,
  method = "PROPFIND",
  extraHeaders: {} = { "Content-Type": "application/xml; charset=utf-8" },
) {
  const { password, id: username } = initializeStore({}).getState().user.user;

  const config: any = {
    method,
    url: `${publicRuntimeConfig.api.baseUrl}/remote.php/${removeCornerSlash(path)}`,
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
