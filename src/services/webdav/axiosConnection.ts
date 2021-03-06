/* eslint-disable @typescript-eslint/ban-types */
import axios from "axios";
import { initializeStore } from "@/store/index";
import getConfig from "next/config";
import { parseXML, RequestDataPayload } from "webdav";
import { encodeURLAxios } from "@/utils/utils";

const { publicRuntimeConfig } = getConfig();

export default async function axiosConnection(
  data: RequestDataPayload | null | {},
  context = "systemtags",
  method = "PROPFIND",
  extraHeaders: {} = { "Content-Type": "application/xml; charset=utf-8" },
  rootContext = false,
) {
  const { password, id: username } = initializeStore({}).getState().user.user;
  let path = `${publicRuntimeConfig.api.baseUrl}/remote.php`;
  if (!rootContext) {
    path += "/dav";
  }

  const config: any = {
    method,
    url: `${path}/${encodeURLAxios(context)}`,
    headers: {
      "OCS-APIRequest": true,
      ...extraHeaders,
    },
    auth: {
      username,
      password,
    },
    data,
  };

  const resp = await axios(config);
  const responseData: string = resp.data.toString();
  return parseXML(responseData);
}
