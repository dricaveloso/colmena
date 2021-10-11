import React, { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import LayoutApp from "@/components/statefull/LayoutApp";
import { GetStaticProps } from "next";
import { I18nInterface, LibraryItemInterface, RecordingInterface } from "@/interfaces/index";
import { listDirectories } from "@/services/webdav/directories";
import { PropsUserSelector } from "@/types/index";
import { useSelector } from "react-redux";
import { FileStat } from "webdav";
import { getAllAudios } from "@/store/idb/models/audios";
import { EnvironmentEnum, JustifyContentEnum, ListTypeEnum } from "@/enums/index";
import FlexBox from "@/components/ui/FlexBox";
import { Box } from "@material-ui/core";
import ItemList from "@/components/pages/library/ItemList";
import HeaderBar from "@/components/pages/library/HeaderBar";
import { useRouter } from "next/router";
import Loading from "@/components/ui/Loading";
import { getExtensionFilename } from "@/utils/utils";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["drawer", "common", "library"])),
  },
});

function MyLibrary() {
  const [currentDirectory, setCurrentDirectory] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [listType, setListType] = useState(ListTypeEnum.LIST);
  const router = useRouter();
  const { path } = router.query;
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [items, setItems] = useState<Array<LibraryItemInterface>>(
    [] as Array<LibraryItemInterface>,
  );

  useEffect(() => {
    if (typeof path === "object") {
      setCurrentDirectory(path.join("/"));
    } else {
      setCurrentDirectory("/");
    }
  }, [path]);

  useEffect(() => {
    (async () => {
      if (currentDirectory !== undefined) {
        try {
          setIsLoading(true);
          const nxDirectories = await listDirectories(userRdx.user.id, currentDirectory);
          const newItems: LibraryItemInterface[] = [];
          if (nxDirectories?.data.length > 0) {
            nxDirectories.data.forEach((directory: FileStat) => {
              const filename = directory.filename.replace(/^.+?(\/|$)/, "");
              if (filename !== "" && filename !== currentDirectory) {
                const item: LibraryItemInterface = {
                  basename: directory.basename,
                  id: directory.filename,
                  filename,
                  type: directory.type,
                  environment: EnvironmentEnum.REMOTE,
                  extension: getExtensionFilename(filename),
                };

                newItems.push(item);
              }
            });
          }

          if (currentDirectory === "/") {
            const localFiles = await getAllAudios(userRdx.user.id);
            if (localFiles.length > 0) {
              localFiles.forEach((file: RecordingInterface) => {
                const item: LibraryItemInterface = {
                  basename: file.title,
                  id: file.id,
                  type: "audio",
                  environment: EnvironmentEnum.LOCAL,
                  extension: "ogg",
                };

                newItems.push(item);
              });
            }
          }

          newItems.sort((a, b) => {
            if (
              a.createdAt !== undefined &&
              b.createdAt !== undefined &&
              a.createdAt > b.createdAt
            ) {
              return 1;
            }

            return -1;
          });

          setItems(newItems);
        } catch (e) {
          console.log(e);
        }

        setIsLoading(false);
      }
    })();
  }, [userRdx, currentDirectory]);

  return (
    <LayoutApp title="Library">
      <HeaderBar path={path} listType={listType} setListType={setListType} />
      {isLoading && (
        <FlexBox justifyContent={JustifyContentEnum.CENTER}>
          <Loading />
        </FlexBox>
      )}
      {!isLoading && (
        <FlexBox justifyContent={JustifyContentEnum.FLEXSTART}>
          <Box width="100%">
            <Box width="100%">
              <ItemList items={items} type={listType} />
            </Box>
          </Box>
        </FlexBox>
      )}
    </LayoutApp>
  );
}

export default MyLibrary;
