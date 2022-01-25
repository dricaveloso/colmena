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

function doRequest(url: any): Promise<ResponseDataAvatar> {
  return new Promise((resolve, reject) => {
    request(url, (error: any, res: any) => {
      if (!error && res.statusCode === 200) {
        resolve(res);
      } else {
        reject(error);
      }
    });
  });
}

handler.post(async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { user, password, extension, width, height, x, y } = req.body;
  const filename = `${process.cwd()}/public/upload/avatar-${user}.${extension}`;
  try {
    const response = await axios.get(`${serverRuntimeConfig.api.baseUrl}/login`);

    if (!response.headers["set-cookie"]) throw new Error("err");

    let cookies = formatCookies(response.headers["set-cookie"]);

    const root = parse(response.data);
    const requesttoken = String(root.querySelector("head").getAttribute("data-requesttoken"));

    const basicAuth = btoa(`${user}:${password}`);

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

    const responseAvatar = await doRequest(optionsAvatar);

    cookies = formatCookies(responseAvatar.headers["set-cookie"], cookies);

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
        "crop[x]": x,
        "crop[y]": y,
        "crop[w]": width,
        "crop[h]": height,
      },
    };

    const responseAvatarCropped = await doRequest(optionsCropped);

    const result = JSON.parse(responseAvatarCropped.body.trim());
    if (result.status !== "success") throw new Error("Error");

    fs.unlinkSync(filename);

    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);

    fs.unlinkSync(filename);
    res.status(400).json({ success: false, error: e });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
