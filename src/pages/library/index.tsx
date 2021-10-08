import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import LayoutApp from "@/components/statefull/LayoutApp";
import { GetStaticProps } from "next";
import {
  BreadcrumbItemInterface,
  I18nInterface,
  LibraryItemInterface,
  RecordingInterface,
} from "@/interfaces/index";
import { listDirectories } from "@/services/webdav/directories";
import { PropsUserSelector } from "@/types/index";
import { useSelector } from "react-redux";
import { FileStat } from "webdav";
import { getAllAudios } from "@/store/idb/models/audios";
import { EnvironmentEnum, JustifyContentEnum } from "@/enums/index";
import FlexBox from "@/components/ui/FlexBox";
import { Box } from "@material-ui/core";
import ItemList from "@/components/pages/library/ItemList";
import { useRouter } from "next/router";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@/components/ui/SvgIcon";
import Loading from "@/components/ui/Loading";
import { getExtensionFilename, createBreadcrumb } from "@/utils/utils";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["drawer", "common"])),
  },
});

function MyLibrary() {
  const theme = useTheme();
  const [currentDirectory, setCurrentDirectory] = useState("");
  const [breadcrumb, setBreadcrumb] = useState<Array<BreadcrumbItemInterface>>(
    [] as Array<BreadcrumbItemInterface>,
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { path } = router.query;
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [items, setItems] = useState<Array<LibraryItemInterface>>(
    [] as Array<LibraryItemInterface>,
  );

  useEffect(() => {
    setBreadcrumb(createBreadcrumb(path));

    if (path) {
      setCurrentDirectory(path.join("/"));
    } else {
      setCurrentDirectory("/");
    }
  }, [path]);

  useEffect(() => {
    (async () => {
      if (currentDirectory !== "") {
        try {
          setIsLoading(true);
          const nxDirectories = await listDirectories(userRdx.user.id, currentDirectory);
          const newItems: LibraryItemInterface[] = [];
          if (nxDirectories?.data.length > 0) {
            nxDirectories?.data.forEach((directory: FileStat) => {
              const filename = directory.filename.replace(/^.+?\//, "");
              if (filename !== currentDirectory) {
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

          newItems.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

          setItems(newItems);
        } catch (e) {
          console.log(e);
        }

        setIsLoading(false);
      }
    })();
  }, [userRdx, currentDirectory]);

  const { t } = useTranslation("common");
  return (
    <LayoutApp title="Library">
      <Box
        bgcolor="#F9F9F9"
        color="text.primary"
        justifyContent={JustifyContentEnum.SPACEBETWEEN}
        flexDirection="row"
        display="flex"
        width="100%"
      >
        <Box flex={1} textAlign="left" alignSelf="center" p={1}>
          <Breadcrumbs
            aria-label="breadcrumb"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              flexWrap: "nowrap",
              overflowY: "hidden",
            }}
          >
            <IconButton color="primary" component="span">
              <SvgIcon icon="library" htmlColor="#292929" fontSize="small" />
            </IconButton>
            {breadcrumb.map((dir) => (
              <Button key={dir.path} color="inherit" onClick={() => router.push(dir.path)}>
                {dir.description}
              </Button>
            ))}
          </Breadcrumbs>
        </Box>
        <Box flexDirection="row" display="flex">
          <IconButton color="primary" component="span">
            <SvgIcon icon="settings_adjust" htmlColor="#292929" fontSize="small" />
          </IconButton>
          <IconButton color="primary" component="span">
            <SvgIcon icon="grid" htmlColor="#292929" fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      {isLoading && (
        <FlexBox justifyContent={JustifyContentEnum.CENTER}>
          <Loading />
        </FlexBox>
      )}
      {!isLoading && (
        <FlexBox justifyContent={JustifyContentEnum.FLEXSTART}>
          <Box width="100%">
            <Box width="100%">
              <ItemList items={items} />
            </Box>
          </Box>
        </FlexBox>
      )}
    </LayoutApp>
  );
}

export default MyLibrary;
