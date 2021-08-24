import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { AuthType, createClient, FileStat, ResponseDataDetailed } from "webdav";
import { PropsUserSelector } from "../../types";
import { listAllDirectories } from "@/services/webdav/directories";

export default function WebDav() {
  // const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  useEffect(() => {
    async function getQuota() {
      const teste: Array<FileStat> | ResponseDataDetailed<Array<FileStat>> =
        await listAllDirectories("nil");
      teste.forEach((element) => {
        console.log(element);
      });
    }

    getQuota();
  }, []);

  // console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}/remote.php/dav/files/`);
  // console.log(resp);

  return <div></div>;
}
