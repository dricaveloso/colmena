import axios from "axios";
import { initializeStore } from "@/store/index";
import getConfig from "next/config";
import { parseXML, RequestDataPayload } from "webdav";

const { publicRuntimeConfig } = getConfig();

export default async function axiosConnection(
  data: RequestDataPayload,
  context = "systemtags",
  method = "PROPFIND",
  headers = {},
) {
  const { password, id: username } = initializeStore({}).getState().user.user;

  const config: any = {
    method,
    url: `${publicRuntimeConfig.api.baseUrl}/remote.php/dav/${context}`,
    headers: {
      "OCS-APIRequest": true,
      "Content-Type": "application/xml",
      ...headers,
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
