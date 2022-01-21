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
    console.log(req.body, req.body.user, req.body.password);
    const { user, password } = req.body;
    try {
      let response = await axios.get(`${serverRuntimeConfig.api.baseUrl}/login`);

      if (!response.headers["set-cookie"]) throw new Error("err");

      let cookies = formatCookies(response.headers["set-cookie"]);

      const root = parse(response.data);
      let requesttoken = root.querySelector("head").getAttribute("data-requesttoken");

      console.log(requesttoken);
      console.log(cookies);

      response = await axios.post(
        `${serverRuntimeConfig.api.baseUrl}/login`,
        {
          user,
          password,
        },
        {
          headers: {
            "OCS-APIRequest": true,
            Cookie: cookies,
            requesttoken,
          },
        },
      );

      cookies = formatCookies(response.headers["set-cookie"]);
      requesttoken = root.querySelector("head").getAttribute("data-requesttoken");

      res.status(200).json({ success: true, data: requesttoken });
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, error: e });
    }
  }
}
