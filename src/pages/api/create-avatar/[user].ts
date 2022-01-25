/* eslint-disable no-restricted-syntax */
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import getConfig from "next/config";
import { parse } from "node-html-parser";
import { formatCookies } from "@/utils/utils";
import middleware from "../../../middlewares/middleware";
import nextConnect from "next-connect";
import fs from "fs";
import request from "request";

const { serverRuntimeConfig } = getConfig();

const handler = nextConnect();

handler.use(middleware);

type Data = {
  success: boolean;
  error?: any;
  data?: any;
};

type ResponseDataAvatar = {
  headers: {
    "set-cookie": string[];
  };
  body: string;
};

handler.post(async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { user, password, extension } = req.body;
  try {
    const response = await axios.get(`${serverRuntimeConfig.api.baseUrl}/login`);

    if (!response.headers["set-cookie"]) throw new Error("err");

    let cookies = formatCookies(response.headers["set-cookie"]);

    const root = parse(response.data);
    const requesttoken = String(root.querySelector("head").getAttribute("data-requesttoken"));

    const basicAuth = btoa(`${user}:${password}`);

    const filename = `${process.cwd()}/public/tmp/avatar-${user}.${extension}`;

    const optionsAvatar = {
      method: "POST",
      url: `${serverRuntimeConfig.api.baseUrl}/avatar`,
      headers: {
        "OCS-APIRequest": "true",
        requesttoken,
        Authorization: `Basic ${basicAuth}`,
        "X-Requested-With": "XMLHttpRequest",
        Cookie: cookies,
        "Content-Type": "multipart/form-data",
        "Accept-Encoding": "gzip, deflate, br",
      },
      formData: {
        requesttoken,
        "files[]": {
          value: fs.createReadStream(filename),
          options: {
            filename: "filename",
            contentType: null,
          },
        },
      },
    };

    request(optionsAvatar, (error: string, response: ResponseDataAvatar) => {
      if (error) throw new Error(error);

      cookies = formatCookies(response.headers["set-cookie"], cookies);

      const optionsCropped = {
        method: "POST",
        url: `${serverRuntimeConfig.api.baseUrl}/avatar/cropped`,
        headers: {
          "OCS-APIRequest": true,
          requesttoken,
          Authorization: `Basic ${basicAuth}`,
          "X-Requested-With": "XMLHttpRequest",
          Cookie: cookies,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        form: {
          "crop[x]": "0",
          "crop[y]": "0",
          "crop[w]": "270",
          "crop[h]": "270",
        },
      };

      request(optionsCropped, (error: string, response: ResponseDataAvatar) => {
        if (error) throw new Error(error);

        const result = JSON.parse(response.body.trim());
        if (result.status !== "success") throw new Error("Error");

        fs.unlinkSync(filename);

        res.status(200).json({ success: true });
      });
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false, error: e });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
