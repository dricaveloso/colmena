/* eslint-disable no-restricted-syntax */
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

type Data = {
  success?: boolean;
  error?: any;
  data?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "GET") {
    try {
      const response = await axios.get(
        `${serverRuntimeConfig.api.baseUrl}/apps/groupfolders/folders?format=json`,
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
      const data = response?.data;
      const values = Object.values(data.ocs.data).map((item: any) => item?.mount_point);

      res.status(200).json({ success: true, data: values });
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, error: e.message });
    }
  }
}
