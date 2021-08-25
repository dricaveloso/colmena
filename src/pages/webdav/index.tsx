import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  AuthType,
  createClient,
  FileStat,
  ResponseDataDetailed,
  WebDAVClientContext,
} from "webdav";

import { PropsUserSelector } from "../../types";
import { createDirectory, deleteDirectory, listDirectories } from "@/services/webdav/directories";

export default function WebDav() {
  // const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  useEffect(() => {
    async function getQuota() {
      const userTest = "nil";

      const createF = await createDirectory("nil", "test5Folder");
      console.log("create directory: ", createF);

      const deleteF = await deleteDirectory("nil", "test5Folder");
      console.log("deltete directory: ", deleteF);

      const listD: Array<FileStat> | ResponseDataDetailed<Array<FileStat>> = await listDirectories(
        userTest,
      );
      listD.forEach((element) => {
        console.log(element);
      });
      // verificar erro

      // const deleteDirectory: Array<FileStat> | ResponseDataDetailed<Array<FileStat>> =
      //   await deleteDirectory("nil", "nameFolder6");
      // deleteDirectory.forEach((element) => {
      //   console.log(element);
      // });
    }

    getQuota();
  }, []);

  // console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}/remote.php/dav/files/`);
  // console.log(resp);

  return <div></div>;
}
