/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect } from "react";
import WaveformPlaylist from "waveform-playlist";
import { saveAs } from "file-saver";
import theme from "@/styles/theme";
import Box from "@material-ui/core/Box";
import { makeStyles, Theme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Backdrop from "@/components/ui/Backdrop";
import EventEmitter from "events";
import SvgIcon from "@/components/ui/SvgIcon";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";
import { clockFormatWaveformPlaylist, createBlobFromAudioBuffer } from "@/utils/utils";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { PropsAudioEditorSelector, PropsUserSelector } from "@/types/*";
import { putFile as putFileOnline } from "@/services/webdav/files";
import { blobToArrayBuffer } from "blob-util";
import { toast } from "@/utils/notifications";
import { updateFile as updateFileLocal } from "@/store/idb/models/files";
import { updateFile as updateFileQuickLocal } from "@/store/idb/models/filesQuickBlob";

type Props = {
  urlBlob: string;
  filename: string;
  waveHeight: number;
  ee: EventEmitter;
  localFileId: number | null;
  localFileQuickId: number | null;
};

export function removeElement(id: string) {
  document.getElementById(id)?.remove();
}

export function createCursorElementSelectPosition(id: string, left: string) {
  removeElement(id);
  const div = document.createElement("DIV");
  div.style.position = "absolute";
  div.style.width = "1px";
  div.style.bottom = "0";
  div.style.top = "0";
  div.style.left = left;
  div.style.zIndex = "4";
  div.style.backgroundColor = "yellow";
  div.classList.add("selection");
  div.classList.add("point");
  div.setAttribute("id", id);
  document.getElementsByClassName("waveform")[0].appendChild(div);
}

export function getTextInputValue(id: string): number {
  const elem = document.getElementById(id) as HTMLInputElement;

  if (elem === null) return 0;

  return Number(elem.value);
}

export function setTextInputValue(id: string, val: number | string) {
  const elem = document.getElementById(id) as HTMLInputElement;

  if (elem !== null) elem.value = String(val);
}

export const SAVE_AUDIO_FLAG = "save-audio-flag";

const Waveform = ({ urlBlob, filename, waveHeight, ee, localFileId, localFileQuickId }: Props) => {
  const { t } = useTranslation("editAudio");
  const { t: c } = useTranslation("common");
  const marginBoxContainer = 20;
  const zoomLevels = [500, 1000, 3000, 5000];
  const fatorRewindForward = 10;
  const INIT_CURSOR_SELECT = "init-cursor-select";
  const END_CURSOR_SELECT = "end-cursor-select";
  const START_POSITION_SELECT = "start-position-select";
  const END_POSITION_SELECT = "end-position-select";
  const LOADING_SAVE_AUDIO = "loading-save-audio";

  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      "& .playlist-time-scale .time": {
        color: "gray",
      },
      "& .playlist-tracks .cursor": {
        backgroundColor: "gray",
      },
      "& .playlist-tracks .channel-wrapper": {
        backgroundColor: theme.palette.variation7.dark,
      },
      "& .playlist-tracks": {
        backgroundColor: theme.palette.variation7.dark,
      },
      "& .playlist-tracks .channel-wrapper .waveform": {
        border: "none !important",
      },
    },
    controls: {
      position: "absolute",
      bottom: 5,
      width: "100%",
      display: "flex",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    },
    centerLoading: {
      display: "flex",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      height: "calc(100vh - 70px)",
      width: "100%",
    },
    boxCursorTrim: {
      position: "absolute",
      zIndex: 4,
      marginTop: 30,
      left: 700,
      display: "flex",
      flex: 1,
      justifyContent: "flex-end",
      flexDirection: "column",
      overflow: "hidden",
    },
    cursorTrim: {
      width: 3,
      backgroundColor: "yellow",
      height: waveHeight,
    },
    iconCursorTrim: {
      margin: 0,
      padding: 0,
      height: 21,
    },
    boxContainerNode: {
      paddingLeft: marginBoxContainer,
      paddingRight: marginBoxContainer,
    },
    actionsButton: {
      marginRight: 4,
      "& svg": {
        width: 25,
      },
    },
    textAudioSelected: {
      color: "#B4AEF5",
    },
  }));

  const classes = useStyles();
  const [showControls, setShowControls] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [loadingSaveAudio, setLoadingSaveAudio] = useState(false);
  const audioEditorRdx = useSelector(
    (state: { audioEditor: PropsAudioEditorSelector }) => state.audioEditor,
  );
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  function removeAllCustomCursorElements() {
    document.getElementById(INIT_CURSOR_SELECT)?.remove();
    document.getElementById(END_CURSOR_SELECT)?.remove();
  }

  const myStateCursorRef = React.useRef(false);
  myStateCursorRef.current = audioEditorRdx.isCursorSelected;

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (getTextInputValue(LOADING_SAVE_AUDIO) === 1) setLoadingSaveAudio(true);
      else setLoadingSaveAudio(false);
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!audioEditorRdx.isCursorSelected) {
      setTextInputValue(START_POSITION_SELECT, 0);
      setTextInputValue(END_POSITION_SELECT, 0);
      setTextInputValue(LOADING_SAVE_AUDIO, 0);
    }
  }, [audioEditorRdx.isCursorSelected]);

  const container = useCallback(
    (node) => {
      if (node !== null) {
        const playlist = WaveformPlaylist(
          {
            samplesPerPixel: 500,
            mono: true,
            waveHeight,
            container: node,
            timescale: true,
            state: "cursor",
            barWidth: 2,
            isAutomaticScroll: true,
            barGap: 1,
            colors: {
              waveOutlineColor: theme.palette.variation7.dark,
              timeColor: "gray",
              fadeColor: "black",
            },
            zoomLevels,
          },
          ee,
        );

        ee.on("timeupdate", (playbackPosition: number) => {
          setPlaybackPosition(playbackPosition);
        });

        ee.on("audiosourcesloaded", () => {
          setShowControls(true);
        });

        ee.on("select", (start, end, track) => {
          if (track && track.state === "cursor" && myStateCursorRef.current) {
            setTimeout(() => {
              const currentCursor = document.getElementsByClassName(
                "selection point",
              )[0] as HTMLDivElement;

              if (
                getTextInputValue(START_POSITION_SELECT) === 0 &&
                getTextInputValue(END_POSITION_SELECT) === 0
              ) {
                setTextInputValue(START_POSITION_SELECT, start);
                createCursorElementSelectPosition(INIT_CURSOR_SELECT, currentCursor.style.left);
              } else if (
                getTextInputValue(START_POSITION_SELECT) > 0 &&
                getTextInputValue(END_POSITION_SELECT) === 0
              ) {
                setTextInputValue(END_POSITION_SELECT, start);
                createCursorElementSelectPosition(END_CURSOR_SELECT, currentCursor.style.left);
                removeAllCustomCursorElements();
                ee.emit("select", getTextInputValue(START_POSITION_SELECT), start);
              } else if (
                getTextInputValue(START_POSITION_SELECT) > 0 &&
                getTextInputValue(END_POSITION_SELECT) > 0
              ) {
                const diffStart = Math.abs(getTextInputValue(START_POSITION_SELECT) - start);
                const diffEnd = Math.abs(getTextInputValue(END_POSITION_SELECT) - start);
                if (diffEnd < diffStart) {
                  removeElement(END_CURSOR_SELECT);
                  setTextInputValue(END_POSITION_SELECT, start);
                  createCursorElementSelectPosition(END_CURSOR_SELECT, currentCursor.style.left);
                  ee.emit("select", getTextInputValue(START_POSITION_SELECT), start);
                  removeAllCustomCursorElements();
                } else {
                  removeElement(INIT_CURSOR_SELECT);
                  setTextInputValue(START_POSITION_SELECT, start);
                  createCursorElementSelectPosition(INIT_CURSOR_SELECT, currentCursor.style.left);
                  ee.emit("select", start, getTextInputValue(END_POSITION_SELECT));
                  removeAllCustomCursorElements();
                }
              }
            }, 200);
          }
        });

        ee.on("audiorenderingfinished", async (type, data) => {
          if (type === "wav") {
            const name = filename.split("/").reverse()[0];
            const arr = name.split(".");
            arr.pop();
            saveAs(data, `${arr.join("")}.wav`);
          }
          if (type === "buffer") {
            if (getTextInputValue(SAVE_AUDIO_FLAG) === 1) {
              try {
                setTextInputValue(LOADING_SAVE_AUDIO, 1);
                const blob = createBlobFromAudioBuffer(data, data.length);
                const arrayBuffer = await blobToArrayBuffer(blob);
                await putFileOnline(userRdx.user.id, filename, arrayBuffer);

                if (localFileId)
                  await updateFileLocal(localFileId, { arrayBufferBlob: arrayBuffer });
                if (localFileQuickId)
                  await updateFileQuickLocal(localFileQuickId, { arrayBufferBlob: arrayBuffer });

                toast(t("audioSavedTitle"), "success");
              } catch (e) {
                console.log(e);
                toast(c("genericErrorMessage"), "error");
              } finally {
                setTextInputValue(SAVE_AUDIO_FLAG, 0);
                setTextInputValue(LOADING_SAVE_AUDIO, 0);
              }
            }
          }
        });
        playlist.load([
          {
            src: urlBlob,
            name: filename,
            waveOutlineColor: theme.palette.variation7.dark,
          },
        ]);
        // initialize the WAV exporter.
        playlist.initExporter();
      }
    },
    [ee],
  );

  const showSelectedRegion = () =>
    getTextInputValue(START_POSITION_SELECT) > 0 &&
    getTextInputValue(END_POSITION_SELECT) > 0 &&
    audioEditorRdx.isCursorSelected;

  return (
    <Box className={classes.root}>
      <input type="hidden" id={START_POSITION_SELECT} />
      <input type="hidden" id={END_POSITION_SELECT} />
      <input type="hidden" id={SAVE_AUDIO_FLAG} />
      <input type="hidden" id={LOADING_SAVE_AUDIO} />
      <Backdrop open={loadingSaveAudio} />
      <Backdrop open={!showControls} />
      <Box className={classes.boxContainerNode}>
        <div ref={container}></div>
        {showSelectedRegion() && (
          <Text variant={TextVariantEnum.CAPTION} className={classes.textAudioSelected}>
            {t("regionSelectedTitle", {
              startTime: clockFormatWaveformPlaylist(
                Number(getTextInputValue(START_POSITION_SELECT)),
              ),
              endTime: clockFormatWaveformPlaylist(Number(getTextInputValue(END_POSITION_SELECT))),
            })}
          </Text>
        )}
      </Box>
      {showControls && (
        <Box className={classes.controls}>
          <IconButton
            onClick={() => {
              if (playbackPosition > 0 && playbackPosition > fatorRewindForward)
                ee.emit("play", playbackPosition - fatorRewindForward);
              else if (playbackPosition > 0 && playbackPosition < fatorRewindForward)
                ee.emit("play", 0);
            }}
            className={classes.actionsButton}
          >
            <SvgIcon icon="rewind" htmlColor={theme.palette.icon.light} />
          </IconButton>
          <IconButton
            onClick={() => {
              ee.emit("pause");
            }}
            className={classes.actionsButton}
          >
            <SvgIcon icon="pause_flat" htmlColor={theme.palette.icon.light} />
          </IconButton>
          <IconButton
            onClick={() => {
              ee.emit("play");
            }}
            className={classes.actionsButton}
          >
            <SvgIcon icon="play_flat" htmlColor={theme.palette.icon.light} />
          </IconButton>
          <IconButton
            onClick={() => {
              ee.emit("stop");
            }}
            className={classes.actionsButton}
          >
            <SvgIcon icon="stop_flat" htmlColor={theme.palette.icon.light} />
          </IconButton>
          <IconButton
            onClick={() => {
              ee.emit("play", playbackPosition + fatorRewindForward);
            }}
            className={classes.actionsButton}
          >
            <SvgIcon icon="forward" htmlColor={theme.palette.icon.light} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

const Playlist = (props: Props) => <Waveform {...props}></Waveform>;

// export const MemoizedPlaylist = React.memo(Playlist);
export default Playlist;
