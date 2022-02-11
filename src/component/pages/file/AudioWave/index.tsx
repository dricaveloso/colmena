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
import { getFilename } from "@/utils/directory";
import { PropsLibrarySelector } from "@/types/index";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentAudioPlaying } from "@/store/actions/library";

type Props = {
  blob: Blob | null;
  data: any;
  playingAs?: boolean;
};
export default function AudioWave({ blob, data }: Props) {
  const dispatch = useDispatch();
  const library = useSelector((state: { library: PropsLibrarySelector }) => state.library);
  const [duration, setDuration] = useState(0);
  const filename = data?.filename;
  const getAudio = async () => {
    try {
      if (blob) {
        const audioURL = createObjectURL(blob);
        const duration = await getBlobDuration(audioURL);
        setDuration(duration);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAudio();
  }, [blob]);

  const playPauseAudioHandle = (flag: boolean) => {
    dispatch(setCurrentAudioPlaying(!flag ? filename : ""));
  };

  if (!blob) return <AudioWaveSkeleton />;

  return (
    <Box display="flex" flex={1} flexDirection="row" justifyContent="center" alignItems="center">
      <IconButton
        icon={library.currentAudioPlaying === filename ? "pause" : "play"}
        iconStyle={{ fontSize: 55 }}
        handleClick={() => playPauseAudioHandle(library.currentAudioPlaying === filename)}
        iconColor={theme.palette.primary.main}
      />
      <Box display="flex" marginLeft={1} flexDirection="column" flex={1}>
        <ListItemText
          data-testid="title"
          primary={getFilename(decodeURIComponent(filename))}
          secondary={fancyTimeFormat(duration)}
          secondaryTypographyProps={{ style: { fontSize: 10 } }}
        />
        <Waves
          blob={blob}
          config={{ height: 20 }}
          play={library.currentAudioPlaying === filename}
        />
      </Box>
    </Box>
  );
}
