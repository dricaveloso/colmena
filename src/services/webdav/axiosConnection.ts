/* eslint-disable @typescript-eslint/ban-types */
import axios from "axios";
import { initializeStore } from "@/store/index";
import getConfig from "next/config";
import { parseXML, RequestDataPayload } from "webdav";
import { removeCornerSlash } from "@/utils/utils";

const { publicRuntimeConfig } = getConfig();

export default async function axiosConnection(
  data: RequestDataPayload | {},
  context = "systemtags",
  method = "PROPFIND",
  extraHeaders: {} = { "Content-Type": "application/xml" },
  rootContext = false,
) {
  const { password, id: username } = initializeStore({}).getState().user.user;
  let path = `${publicRuntimeConfig.api.baseUrl}/remote.php`;
  if (!rootContext) {
    path += "/dav";
  }

  const config: any = {
    method,
    url: `${path}/${removeCornerSlash(context)}`,
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
