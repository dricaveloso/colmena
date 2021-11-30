import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

type Data = {
  success: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "DELETE") {
    const { userId } = req.body;
    try {
      await axios.delete(
        `${serverRuntimeConfig.api.baseUrl}/ocs/v2.php/cloud/users/${userId}?format=json`,
        {
          auth: {
            username: serverRuntimeConfig.adminInfo.username || "vinicius",
            password: serverRuntimeConfig.adminInfo.password || "vinicius",
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
