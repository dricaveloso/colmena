/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useState } from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useRouter } from "next/router";
// import { useTranslation } from "next-i18next";
import { GetStaticProps, GetStaticPaths } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum, TextVariantEnum } from "@/enums/index";
import { useSelector } from "react-redux";
// import Chip from "@material-ui/core/Chip";
// import RecordingDoneOptions from "@/components/pages/recording/RecordingDoneOptions";
// import { v4 as uuid } from "uuid";
// import { arrayBufferToBlob, createObjectURL } from "blob-util";
// import { getLastAudioRecordedByUser } from "@/store/idb/models/files";
import { PropsUserSelector } from "@/types/index";
// import CenterProgress from "@/components/ui/CenterProgress";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import ContextMenuFile from "@/components/pages/file/ContextMenu";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Box from "@material-ui/core/Box";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import { getFileTags, ItemTagInterface } from "@/services/webdav/tags";
import { getDataFile } from "@/services/webdav/files";
import Text from "@/components/ui/Text";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["recordingDone"])),
  },
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

function File() {
  const classes = useStyles();
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const router = useRouter();
  const { id } = router.query;
  const filename = atob(String(id));
  const [data, setData] = useState<any>(null);
  const [tags, setTags] = useState<ItemTagInterface[] | false>(false);
  // const { t } = useTranslation("recordingDone");
  // const [audio, setAudio] = useState<RecordingInterface | null>(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result: any = await getDataFile(filename);
        setData(result);

        if (result.fileid) {
          const tags = await getFileTags(userRdx.user.id, filename, result.fileid);
          setTags(tags);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [filename]);

  console.log(data, tags);

  return (
    <LayoutApp title="" back drawer={false} extraElement={<ContextMenuFile />}>
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART} extraStyle={{ padding: 0, margin: 0 }}>
        <Box width="100%">
          <List
            subheader={
              <ListSubheader style={{ backgroundColor: "#F3F3F3" }}>
                <Box padding={2}>
                  <Text
                    variant={TextVariantEnum.BODY1}
                    style={{ fontWeight: "bold", color: "#656469", textAlign: "left" }}
                  >
                    Audios
                  </Text>
                </Box>
              </ListSubheader>
            }
            className={classes.root}
          >
            <ListItem>
              <ListItemIcon></ListItemIcon>
              <ListItemText id="switch-list-label-wifi" primary="Content" />
              <ListItemSecondaryAction></ListItemSecondaryAction>
            </ListItem>
          </List>
          <List
            subheader={
              <ListSubheader style={{ backgroundColor: "#F3F3F3" }}>
                <Box padding={2}>
                  <Text
                    variant={TextVariantEnum.BODY1}
                    style={{ fontWeight: "bold", color: "#656469", textAlign: "left" }}
                  >
                    Description
                  </Text>
                </Box>
              </ListSubheader>
            }
            className={classes.root}
          >
            <ListItem>
              <ListItemText id="description-item" primary="Content" />
              <ListItemSecondaryAction></ListItemSecondaryAction>
            </ListItem>
          </List>
          <List
            subheader={
              <ListSubheader style={{ backgroundColor: "#F3F3F3" }}>
                <Box padding={2}>
                  <Text
                    variant={TextVariantEnum.BODY1}
                    style={{ fontWeight: "bold", color: "#656469", textAlign: "left" }}
                  >
                    Tags
                  </Text>
                </Box>
              </ListSubheader>
            }
            className={classes.root}
          >
            <ListItem>
              <ListItemText id="tags-item" primary="Content" />
              <ListItemSecondaryAction></ListItemSecondaryAction>
            </ListItem>
          </List>
        </Box>
      </FlexBox>
    </LayoutApp>
  );
}

export default File;
