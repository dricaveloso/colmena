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
import { JustifyContentEnum } from "@/enums/index";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import { getDataFile } from "@/services/webdav/files";
import IconButton from "@/components/ui/IconButton";
import { toast } from "@/utils/notifications";
import { MemoizedAudioFile } from "@/components/pages/file/AudioFile";
import { getFilename } from "@/utils/directory";
import theme from "@/styles/theme";
import { Grid } from "@material-ui/core";
import Avatar from "@/components/ui/Avatar";
import Typography from "@material-ui/core/Typography";
import TagsSection from "@/components/pages/file/Sections/Tags";
import DescriptionSection from "@/components/pages/file/Sections/Description";
import DetailsSection from "@/components/pages/file/Sections/Details";
import DownloadModal from "@/components/pages/library/contextMenu/DownloadModal";
// import getBlobDuration from "get-blob-duration";

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
  const filename = atob(String(id));
  const [data, setData] = useState<LibraryItemInterface>({} as LibraryItemInterface);
  const [openDownloadModal, setOpenDownloadModal] = useState(false);

  const { t: c } = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const timeDescription: TimeDescriptionInterface = c("timeDescription", { returnObjects: true });
  // const [duration, setDuration] = useState(0);

  const getFile = async () => {
    try {
      setLoading(true);
      const result: any = await getDataFile(userRdx.user.id, filename, timeDescription);
      setData(result);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDownloadModal = (opt: boolean) => {
    setOpenDownloadModal(opt);
  };

  useEffect(() => {
    getFile();
  }, [filename]);

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
            <div
              style={{
                backgroundColor: theme.palette.primary.main,
                height: "140px",
                display: "flex",
                padding: "0 16px",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div>
                <Avatar size={10} borderRadius="8px!important" />
              </div>
              <Grid container alignItems="baseline" direction="column">
                <Typography
                  style={{
                    color: theme.palette.primary.contrastText,
                    fontWeight: "bold",
                    marginLeft: "12px",
                  }}
                >
                  {getFilename(decodeURIComponent(filename))}
                </Typography>
                <IconButton
                  icon="download"
                  fontSizeIcon="small"
                  iconColor="#fff"
                  handleClick={() => handleOpenDownloadModal(true)}
                  style={{ minWidth: 25, marginLeft: "4px", marginTop: "8px" }}
                />
              </Grid>
            </div>
            <MemoizedAudioFile filename={filename} data={data} />

            <DescriptionSection data={data} setData={setData} loading={loading} />
            <TagsSection data={data} />
            <DetailsSection data={data} />
          </Box>
        </FlexBox>
      </LayoutApp>
      {data && (
        <DownloadModal
          key={`${data.basename}-download-modal`}
          open={openDownloadModal}
          handleOpen={() => handleOpenDownloadModal(false)}
          filename={data.filename}
          basename={data.basename}
          mime={data.mime}
          arrayBufferBlob={data.arrayBufferBlob}
        />
      )}
    </>
  );
}

export default File;
