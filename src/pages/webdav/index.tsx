import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { AuthType, createClient } from "webdav";
import { PropsUserSelector } from "../../types";
import createDirectory from "@/services/webdav/directories";

export default function WebDav() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  useEffect(() => {
    async function getQuota() {
      //   const client = createClient(
      //     `${process.env.NEXT_PUBLIC_API_BASE_URL}/remote.php/dav/files/`,
      //     {
      //       authType: AuthType.Token,
      //       token: {
      //         access_token: userRdx.user.userToken,
      //         token_type: "Bearer",
      //       },
      //     },
      //   );
      console.log(createDirectory());

      // const del = await client.(`${userRdx.user.id}/teste2.md`);
      // const test = await client.exists(`${userRdx.user.id}/teste1.md`);
      // console.log("aqui exists",test);
      // // diretorio Atual
      // const contents = await client.getDirectoryContents(`${userRdx.user.id}/`);
      // console.log("Get current directory contents:  ", contents);
      // const contentsAll = await client.getDirectoryContents(`${userRdx.user.id}/`, { deep: true });
      // console.log("Get all contents:", contentsAll);
      // // imagens
      // const images = await client.getDirectoryContents(`${userRdx.user.id}/`, {
      //   deep: true,
      //   glob: "/**/*.{png,jpg,gif}",
      // });
      // console.log("list images all foders", images);
      // // create directory
      // const folder = await client.createDirectory(`${userRdx.user.id}/folderTeste`);
      // console.log("create Folder", folder);
      // Upload a file and log the progress to the console:
      // const imageFile = "";
      // await client.putFileContents(`${userRdx.user.id}/folderTeste/versel.svg`, imageFile, {
      //   onUploadProgress: (progress) => {
      //     console.log(`Uploaded ${progress.loaded} bytes of ${progress.total}`);
      //   },
      // });
      // const contentsFolder = await client.getDirectoryContents(`${userRdx.user.id}/folderTeste`);
      // console.log("Get current directory contents:  ", contentsFolder);
      //   // delete file or folder
      //   const del = await client.deleteFile(`${userRdx.user.id}/folderTeste`);
      //   console.log(del);
    }

    getQuota();
  }, [userRdx.user.userToken]);

  // console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}/remote.php/dav/files/`);
  // console.log(resp);

  return <div></div>;
}
