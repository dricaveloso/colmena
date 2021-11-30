/* eslint-disable no-restricted-syntax */
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import getConfig from "next/config";
import { parse } from "node-html-parser";
import { formatCookies } from "@/utils/utils";

const { serverRuntimeConfig } = getConfig();

type Data = {
  success: boolean;
  error?: any;
  data?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "POST") {
    const { email } = req.body;
    try {
      const response = await axios.get(`${serverRuntimeConfig.api.baseUrl}/login`);

      if (!response.headers["set-cookie"]) throw new Error("err");

      const cookies = formatCookies(response.headers["set-cookie"]);

      const root = parse(response.data);
      const requesttoken = root.querySelector("head").getAttribute("data-requesttoken");

      const result = await axios.post(
        `${serverRuntimeConfig.api.baseUrl}/lostpassword/email`,
        {
          user: email,
        },
        {
          headers: {
            Cookie: cookies,
            requesttoken,
          },
        },
      );
      res.status(200).json({ success: result.data.status });
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, error: e });
    }
  }
}
