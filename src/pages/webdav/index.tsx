import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  AuthType,
  createClient,
  BufferLike,
  FileStat,
  ResponseDataDetailed,
  WebDAVClientContext,
} from "webdav";

import { PropsUserSelector } from "../../types";
import { createDirectory, deleteDirectory, listDirectories } from "@/services/webdav/directories";
import { listFile, moveFile, copyFile, deleteFile, putFile } from "@/services/webdav/files";
import { string } from "yup/lib/locale";

export default function WebDav() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  console.log(userRdx.user.id);

  useEffect(() => {
    async function getQuota() {
      // const userTest = "nil";

      // const createF = await createDirectory("nil", "test5Folder");
      // console.log("create directory: ", createF);

      // const deleteF = await deleteDirectory("nil", "test5Folder");
      // console.log("deltete directory: ", deleteF);

      const listD: Array<FileStat> | ResponseDataDetailed<Array<FileStat>> = await listDirectories(
        userRdx.user.id,
      );
      // listD.forEach((element) => {
      console.log(listD);
      // });
      // // verificar erro

      // volta um binário
      // const listF = await listFile(userTest, "/Photos/Toucan.jpg");
      // console.log(listF);

      // const moveF = await moveFile(userTest, "teste55.md", "teste5555.md");
      // console.log(moveF);

      // const copyF = await copyFile(userTest, "teste5555.md", "/test3Folder/teste55.md");
      // console.log(copyF);

      // const putF = await putFile(userTest, "teste5.md", "novo texto 2");
      // console.log(putF);

      // const delF = await deleteFile(userTest, "teste5.md");
      // console.log("deltete directory: ", delF);

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
