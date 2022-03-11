/* eslint-disable no-restricted-syntax */
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

type Data = {
  success: boolean;
  error?: any;
  data?: any;
};

const version = serverRuntimeConfig.ncTalkVersion || "v3";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "POST") {
    const { token, newParticipant } = req.body;
    try {
      await axios.post(
        `${serverRuntimeConfig.api.baseUrl}/ocs/v2.php/apps/spreed/api/${version}/room/${token}/participants?format=json`,
        {
          newParticipant,
          source: "users",
        },
        {
          auth: {
            username: serverRuntimeConfig.adminInfo.username || "",
            password: serverRuntimeConfig.adminInfo.password || "",
          },
          headers: {
            "OCS-APIRequest": true,
          },
        },
      );
      res.status(200).json({ success: true });
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false });
    }
  }
}
