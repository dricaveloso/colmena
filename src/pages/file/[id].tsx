/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useState } from "react";
import FlexBox from "@/components/ui/FlexBox";
import Box from "@material-ui/core/Box";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { GetStaticProps, GetStaticPaths } from "next";
import { I18nInterface, LibraryItemInterface, TimeDescriptionInterface } from "@/interfaces/index";
import { EnvironmentEnum, JustifyContentEnum } from "@/enums/index";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import { getDataFile } from "@/services/webdav/files";
import IconButton from "@/components/ui/IconButton";
import { toast } from "@/utils/notifications";
import { getPath } from "@/utils/directory";
import TagsSection from "@/components/pages/file/Sections/Tags";
import DescriptionSection from "@/components/pages/file/Sections/Description";
import DetailsSection from "@/components/pages/file/Sections/Details";
import FileSection from "@/components/pages/file/Sections/File";
import { applyLocalItemInterface, mergeEnvItems } from "@/components/pages/library";
import { findByFilename } from "@/store/idb/models/files";
import FileHeader from "@/components/pages/file/Header";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["file", "library"])),
  },
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

function File() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const router = useRouter();
  const { id } = router.query;
  const [filename, setFilename] = useState<string | null>(null);
  const [data, setData] = useState<LibraryItemInterface>({} as LibraryItemInterface);

  const { t: c } = useTranslation("common");
  const { t } = useTranslation("file");
  const [loading, setLoading] = useState(false);
  const timeDescription: TimeDescriptionInterface = c("timeDescription", { returnObjects: true });

  const getFile = async () => {
    if (!filename) {
      return;
    }

    setLoading(true);
    let remoteItem = null;
    let localItem = null;
    try {
      const localResult = await findByFilename(filename);
      if (localResult) {
        localItem = applyLocalItemInterface(localResult, timeDescription);
      }
    } catch (e) {
      console.log(e);
    }

    try {
      const remoteResult = await getDataFile(userRdx.user.id, filename, timeDescription);
      if (remoteResult) {
        remoteItem = remoteResult;
      }
    } catch (e) {
      console.log(e);
    }

    const item = mergeEnvItems(localItem, remoteItem);
    if (item) {
      setData(item);
      setLoading(false);
    } else {
      errorNotFound();
    }
  };

  const errorNotFound = () => {
    toast(t("messages.fileNotFound"), "error");
    if (filename) {
      router.push(`/library/${getPath(filename)}`);
    } else {
      router.push("/library");
    }
  };

  useEffect(() => {
    try {
      setFilename(atob(String(id)));
      getFile();
    } catch (e) {
      errorNotFound();
    }
  }, [filename]);

  if (!filename) return null;

  return (
    <>
      <LayoutApp
        title=""
        back
        drawer={false}
        extraElement={
          <IconButton
            icon="share"
            fontSizeIcon="small"
            iconColor="#fff"
            handleClick={() => toast(c("featureUnavailable"), "warning")}
            style={{ minWidth: 25 }}
          />
        }
      >
        <FlexBox
          justifyContent={JustifyContentEnum.FLEXSTART}
          extraStyle={{ padding: 0, margin: 0 }}
        >
          <Box width="100%">
            <FileHeader data={data} setData={setData} loading={loading} />
            <FileSection data={data} setData={setData} loading={loading} />
            <DescriptionSection data={data} setData={setData} loading={loading} />
            {data.environment !== EnvironmentEnum.LOCAL && <TagsSection data={data} />}
            <DetailsSection data={data} />
          </Box>
        </FlexBox>
      </LayoutApp>
    </>
  );
}

export default File;
