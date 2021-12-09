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
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum } from "@/enums/index";
import { useSelector } from "react-redux";
import Chip from "@material-ui/core/Chip";
import { v4 as uuid } from "uuid";
import { PropsUserSelector } from "@/types/index";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import ListItemText from "@material-ui/core/ListItemText";
import { getFileTags, ItemTagInterface } from "@/services/webdav/tags";
import { getDataFile } from "@/services/webdav/files";
import IconButton from "@/components/ui/IconButton";
import { toast } from "@/utils/notifications";
import Section from "@/components/pages/file/Section";
import Skeleton from "@material-ui/lab/Skeleton";
import AudioFile from "@/components/pages/file/AudioFile";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["file"])),
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
  const [data, setData] = useState<any>(null);

  const [tags, setTags] = useState<ItemTagInterface[]>([]);
  const { t } = useTranslation("file");
  const { t: c } = useTranslation("common");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result: any = await getDataFile(filename);
        setData(result);

        if (result.fileid) {
          const tags = await getFileTags(userRdx.user.id, filename, result.fileid);
          setTags(!tags ? [] : tags);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [filename]);

  return (
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
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART} extraStyle={{ padding: 0, margin: 0 }}>
        <Box width="100%">
          <AudioFile filename={filename} data={data} />
          <Section
            title={t("descriptionTitle")}
            secondaryAction={
              <IconButton
                icon="edit"
                fontSizeIcon="small"
                handleClick={() => toast(c("featureUnavailable"), "warning")}
                style={{ minWidth: 25 }}
              />
            }
          >
            {loading ? (
              <Box display="flex" flex={1} flexDirection="column" justifyContent="space-between">
                <Skeleton width="100%" />
                <Skeleton width="70%" />
                <Skeleton width="80%" />
              </Box>
            ) : data && data.description ? (
              <ListItemText id="description-item" primary={data.description} />
            ) : (
              <ListItemText
                id="description-item"
                primaryTypographyProps={{ style: { color: "gray" } }}
                primary="Update file description"
              />
            )}
          </Section>
          <Section
            title={t("tagTitle")}
            secondaryAction={
              <IconButton
                icon="plus"
                fontSizeIcon="small"
                handleClick={() => toast(c("featureUnavailable"), "warning")}
                style={{ minWidth: 25 }}
              />
            }
          >
            {loading ? (
              <Box display="flex" flex={1} flexDirection="row" justifyContent="flex-start">
                <Skeleton style={{ marginRight: 10 }} width={80} height={30} />
                <Skeleton style={{ marginRight: 10 }} width={50} height={30} />
                <Skeleton style={{ marginRight: 10 }} width={90} height={30} />
                <Skeleton style={{ marginRight: 10 }} width={70} height={30} />
              </Box>
            ) : (
              Array.isArray(tags) &&
              tags.length > 0 &&
              tags.map((item: ItemTagInterface) => (
                <Chip key={uuid()} label={item["display-name"]} style={{ marginRight: 5 }} />
              ))
            )}
          </Section>
        </Box>
      </FlexBox>
    </LayoutApp>
  );
}

export default File;
