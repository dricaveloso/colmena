/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect } from "react";
import WaveformPlaylist from "waveform-playlist";
// import { saveAs } from "file-saver";
import theme from "@/styles/theme";
import Box from "@material-ui/core/Box";
import { makeStyles, Theme } from "@material-ui/core/styles";
import IconButton from "@/components/ui/IconButton";
import Backdrop from "@/components/ui/Backdrop";
import EventEmitter from "events";

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
    "& .playlist-tracks .channel-wrapper .waveform": {
      border: "none !important",
    },
  },
  controls: {
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
}));

type Props = {
  urlBlob: string;
  filename: string;
  waveHeight: number;
  ee: EventEmitter;
};

const Waveform = ({ urlBlob, filename, waveHeight, ee }: Props) => {
  const classes = useStyles();
  const [showControls, setShowControls] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const fatorRewindForward = 10;

  useEffect(() => {
    ee.on("timeupdate", (playbackPosition: number) => {
      setPlaybackPosition(playbackPosition);
    });

    ee.on("audiosourcesloaded", () => {
      setShowControls(true);
    });
  }, []);

  const container = useCallback((node) => {
    if (node !== null) {
      const playlist = WaveformPlaylist(
        {
          samplesPerPixel: 1000,
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
          zoomLevels: [500, 1000, 3000, 5000],
        },
        ee,
      );

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
  }, []);

  const iconStyle = {
    height: 30,
  };

  return (
    <Box className={classes.root}>
      <Backdrop open={!showControls} />
      <div ref={container}></div>
      {showControls && (
        <Box className={classes.controls}>
          <IconButton
            icon="rewind"
            iconColor={theme.palette.icon.light}
            handleClick={() => {
              if (playbackPosition > 0 && playbackPosition > fatorRewindForward)
                ee.emit("play", playbackPosition - fatorRewindForward);
              else if (playbackPosition > 0 && playbackPosition < fatorRewindForward)
                ee.emit("play", 0);
            }}
            iconStyle={iconStyle}
          />
          <IconButton
            icon="pause_flat"
            iconColor={theme.palette.icon.light}
            handleClick={() => {
              ee.emit("pause");
            }}
            iconStyle={iconStyle}
          />
          <IconButton
            icon="play_flat"
            iconColor={theme.palette.icon.light}
            handleClick={() => {
              ee.emit("play");
            }}
            iconStyle={iconStyle}
          />
          <IconButton
            icon="stop_flat"
            iconColor={theme.palette.icon.light}
            handleClick={() => {
              ee.emit("stop");
            }}
            iconStyle={iconStyle}
          />
          <IconButton
            icon="forward"
            iconColor={theme.palette.icon.light}
            handleClick={() => {
              ee.emit("play", playbackPosition + fatorRewindForward);
            }}
            iconStyle={iconStyle}
          />
        </Box>
      )}
    </Box>
  );
};

const Playlist = (props: Props) => <Waveform {...props}></Waveform>;

export const MemoizedPlaylist = React.memo(Playlist);
