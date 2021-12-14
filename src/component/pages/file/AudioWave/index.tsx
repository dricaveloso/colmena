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

type Props = {
  blob: Blob | null;
  data: any;
};
export default function AudioWave({ blob, data }: Props) {
  const [playing, setPlaying] = useState(false);
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

  return (
    <Box display="flex" flex={1} flexDirection="row">
      <IconButton
        icon={playing ? "pause" : "play"}
        iconStyle={{ fontSize: 55 }}
        handleClick={handlePlayPause}
        iconColor={theme.palette.primary.main}
      />
      {playing ? (
        <Waves blob={blob} />
      ) : (
        <Box display="flex" marginLeft={1} style={{ display: playing ? "none" : "block" }} flex={1}>
          <ListItemText
            data-testid="title"
            primary={data?.customtitle}
            secondary={fancyTimeFormat(duration)}
          />
        </Box>
      )}
    </Box>
  );
}
