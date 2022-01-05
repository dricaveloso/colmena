/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import theme from "@/styles/theme";
import Box from "@material-ui/core/Box";
import IconButton from "@/components/ui/IconButton";
import Waves from "@/components/pages/file/AudioWave/Waves";
import ListItemText from "@material-ui/core/ListItemText";
import getBlobDuration from "get-blob-duration";
import { fancyTimeFormat } from "@/utils/utils";
import { createObjectURL } from "blob-util";
import AudioWaveSkeleton from "./skeleton";

type Props = {
  blob: Blob | null;
  data: any;
  playingAs: boolean;
};
export default function AudioWave({ blob, data, playingAs = false }: Props) {
  const [playing, setPlaying] = useState(playingAs);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        if (blob) {
          const audioURL = createObjectURL(blob);
          const duration = await getBlobDuration(audioURL);
          setDuration(duration);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [blob]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  if (!blob) return <AudioWaveSkeleton />;

  return (
    <Box display="flex" flex={1} flexDirection="row" justifyContent="center" alignItems="center">
      <IconButton
        icon={playing ? "pause" : "play"}
        iconStyle={{ fontSize: 55 }}
        handleClick={handlePlayPause}
        iconColor={theme.palette.primary.main}
      />
      <Box display="flex" marginLeft={1} flexDirection="column" flex={1}>
        <ListItemText
          data-testid="title"
          primary={data?.customtitle}
          secondary={fancyTimeFormat(duration)}
          secondaryTypographyProps={{ style: { fontSize: 10 } }}
        />
        <Waves blob={blob} config={{ height: 20 }} play={playing} />
      </Box>
    </Box>
  );
}
