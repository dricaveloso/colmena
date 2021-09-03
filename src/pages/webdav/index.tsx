import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FileStat, ResponseDataDetailed } from "webdav";

import { PropsUserSelector } from "../../types";
import {
  createDirectory,
  deleteDirectory,
  listDirectories,
  existDirectory,
} from "@/services/webdav/directories";
import { listFile, moveFile, copyFile, deleteFile, putFile } from "@/services/webdav/files";
import CONSTANTS from "@/constants/index";
import VerticalListWebDav from "@/components/ui/VerticalListWebDav";
import LayoutApp from "@/components/statefull/LayoutApp";
import { JustifyContentEnum } from "@/enums/*";
import FlexBox from "@/components/ui/FlexBox";

export default function WebDav() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [data, setData] = useState([]);
  const directory = "";
  async function CreateDirectory() {
    const exist = await existDirectory(userRdx.user.id, "test2Folder");
    console.log("exist directory: ", exist);
    if (!exist) {
      const createF = await createDirectory(userRdx.user.id, directory);
      console.log("create directory: ", createF);
    }
  }
  async function ListDirect() {
    try {
      const listD: Array<FileStat> | ResponseDataDetailed<Array<FileStat>> = await listDirectories(
        userRdx.user.id,
      );
      // const result = listD.data.shift();

      // console.log(result);
      // console.log(listD.data);

      setData(listD.data);
    } catch (e) {
      console.log("error", e);
    }
  }
  return (
    <LayoutApp title={CONSTANTS.APP_NAME}>
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART}>
        <div style={{ width: "100vw", margin: 5 }}>
          <FlexBox>
            <div>
              <button type="button" onClick={ListDirect}>
                Listar
              </button>
            </div>
          </FlexBox>

          <VerticalListWebDav data={data} />
        </div>
      </FlexBox>
    </LayoutApp>
  );
}
