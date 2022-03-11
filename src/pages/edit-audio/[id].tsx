/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useState } from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { GetStaticProps, GetStaticPaths } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum } from "@/enums/index";
import { useSelector, useDispatch } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import { listFile } from "@/services/webdav/files";
import { toast } from "@/utils/notifications";
import dynamic from "next/dynamic";
import {
  createFile as createQuickBlob,
  findByBasename as findByBasenameQuickBlob,
  removeFile,
} from "@/store/idb/models/filesQuickBlob";
import { findByBasename } from "@/store/idb/models/files";
import { removeSpecialCharacters } from "@/utils/utils";
import { arrayBufferToBlob, createObjectURL } from "blob-util";
import RotateYourDevice from "@/components/pages/edit-audio/RotateYourDevice";
import Box from "@material-ui/core/Box";
import Playlist, {
  getTextInputValue,
  START_POSITION_SELECT,
  END_POSITION_SELECT,
} from "@/components/pages/edit-audio/WaveformPlaylist";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Backdrop from "@/components/ui/Backdrop";
import EventEmitter from "events";
import HeaderPortraitControls from "@/components/pages/edit-audio/HeaderPortraitControls";
import HeaderLandscapeControls from "@/components/pages/edit-audio/HeaderLandscapeControls";
import { setCursorSelected } from "@/store/actions/audio-editor/index";

const useStyles = makeStyles((theme: Theme) => ({
  frameWaveform: {
    width: "100%",
    "& .device-orientation-edit-audio": {
      width: "100%",
      backgroundColor: theme.palette.variation7.dark,
    },
  },
  flexboxWrapper: {
    padding: "0 !important",
    margin: "0 !important",
    backgroundColor: theme.palette.variation7.dark,
  },
  centerLoading: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "calc(100vh - 70px)",
    width: "100%",
  },
}));

type OrientationType = {
  orientation: "landscape" | "portrait";
  alwaysRender?: boolean;
  children: React.ReactNode;
  className?: string;
};

type DeviceOrientationType = {
  lockOrientation: string;
  children: React.ReactNode;
  className?: string;
};

const DeviceOrientation = dynamic<DeviceOrientationType>(() => import("react-screen-orientation"), {
  ssr: false,
});
const Orientation = dynamic<OrientationType>(
  () => import("react-screen-orientation").then((module) => module.Orientation),
  { ssr: false },
);

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["editAudio", "common"])),
  },
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

function EditAudio() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const router = useRouter();
  const [urlBlob, setUrlBlob] = useState<string | null>(null);
  const { id } = router.query;
  const filename = atob(String(id));
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [isPortraitView, setIsPortraitView] = useState(true);
  const [ee] = useState(new EventEmitter());

  const { t: c } = useTranslation("common");
  const { t } = useTranslation("editAudio");
  const [loading, setLoading] = useState(false);

  async function prepareAudioBlob(content: ArrayBuffer) {
    const blob = arrayBufferToBlob(content);
    const urlBlob = createObjectURL(blob);
    setUrlBlob(urlBlob);
  }

  const init = async () => {
    try {
      const localFile = await findByBasename(userRdx.user.id, removeSpecialCharacters(filename));
      const localFileQuickBlob = await findByBasenameQuickBlob(
        userRdx.user.id,
        removeSpecialCharacters(filename),
      );
      if (!localFile && !localFileQuickBlob) {
        setLoading(true);
        const result: any = await listFile(userRdx.user.id, filename);
        removeFile(userRdx.user.id, removeSpecialCharacters(filename));
        await createQuickBlob({
          basename: removeSpecialCharacters(filename),
          userId: userRdx.user.id,
          arrayBufferBlob: result,
        });
        await prepareAudioBlob(result);
      } else {
        await prepareAudioBlob(localFile?.arrayBufferBlob || localFileQuickBlob?.arrayBufferBlob);
      }
    } catch (e) {
      console.log(e);
      toast(c("genericErrorMessage"), "error");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const verifyScreenOrientation = () => {
    if (window.innerHeight > window.innerWidth) {
      setIsPortraitView(true);
      setDynamicHeight(window.innerHeight * 0.6);
    } else {
      setDynamicHeight(window.innerHeight * 0.34);
      setIsPortraitView(false);
    }
  };

  useEffect(() => {
    init();
    verifyScreenOrientation();
    dispatch(setCursorSelected(false));
    window.addEventListener(
      "resize",
      () => {
        verifyScreenOrientation();
      },
      false,
    );
  }, []);

  const handleZoomIn = () => {
    ee.emit("zoomin");
  };

  const handleZoomOut = () => {
    ee.emit("zoomout");
  };

  const handleTrim = () => {
    if (getTextInputValue(START_POSITION_SELECT) > 0 && getTextInputValue(END_POSITION_SELECT) > 0)
      ee.emit("trim");
  };

  const handleDownload = () => {
    toast(c("featureUnavailable"), "warning");
    // ee.emit("startaudiorendering", "wav");
  };

  const handleSave = () => {
    ee.emit("startaudiorendering", "buffer");
  };

  const handleSelectAudioRegion = (type: string) => {
    ee.emit("statechange", type);
  };

  return (
    <LayoutApp
      templateHeader="variation3"
      showFooter={false}
      title={t("title")}
      subtitle={filename.split("/").reverse()[0]}
      back
      drawer={false}
      extraElement={
        isPortraitView ? (
          <HeaderPortraitControls
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleTrim={handleTrim}
            handleSelectAudioRegion={handleSelectAudioRegion}
            handleDownload={handleDownload}
            handleSave={handleSave}
          />
        ) : (
          <HeaderLandscapeControls
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleTrim={handleTrim}
            handleSelectAudioRegion={handleSelectAudioRegion}
            handleDownload={handleDownload}
            handleSave={handleSave}
          />
        )
      }
    >
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART} className={classes.flexboxWrapper}>
        <Box className={classes.frameWaveform}>
          <DeviceOrientation lockOrientation="landscape" className="device-orientation-edit-audio">
            <Orientation orientation="portrait">
              <RotateYourDevice title={t("rotateYourDeviceTitle")} />
            </Orientation>
            <Orientation orientation="landscape" alwaysRender>
              {loading || !urlBlob ? (
                <Backdrop open={loading} />
              ) : (
                <Playlist
                  urlBlob={urlBlob}
                  waveHeight={dynamicHeight}
                  filename={filename}
                  ee={ee}
                />
              )}
            </Orientation>
          </DeviceOrientation>
        </Box>
      </FlexBox>
    </LayoutApp>
  );
}

export default EditAudio;
