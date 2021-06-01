import React, { useState } from "react";
import Container from "component/ui/Container";
import FlexBox from "component/ui/FlexBox";
import AppBar from "component/statefull/AppBar";
import IconButton from "component/ui/IconButton";
import Button from "component/ui/Button";
import Icon from "@material-ui/core/Icon";
import { useRouter } from "next/router";
import Lottie from "react-lottie";
import Recording from "component/ui/lottie/recording.json";
import SoundWave from "component/ui/lottie/sound-wave.json";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import useTranslation from "hooks/useTranslation";

function Record(props) {
  const router = useRouter();
  const { t } = useTranslation(props.lang, "record");

  const [showWaves, setShowWaves] = useState(false);
  const [recordingOptions, setRecordingOptions] = useState({
    loop: false,
    autoplay: false,
    animationData: Recording,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  });

  const soundWavesOptions = {
    loop: true,
    autoplay: true,
    animationData: SoundWave,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const start = () => {
    if (showWaves) {
      router.push("/record-done");
    } else {
      setRecordingOptions({
        ...recordingOptions,
        loop: true,
        autoplay: true,
      });
      setShowWaves(true);
    }
  };

  return (
    <Container extraStyle={{ padding: 0 }}>
      <FlexBox extraStyle={{ padding: 0 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <AppBar title={t?.title} />
          <Button
            variant="outlined"
            style={{ paddingTop: 10, paddingBottom: 10 }}
            color="primary"
            size="large"
            handleClick={() => router.push("/invite")}
            block
            title={t?.textInvite}
            endIcon={<PersonAddIcon />}
          />
        </div>

        {showWaves && (
          <Lottie options={soundWavesOptions} height={250} width={250} />
        )}

        <button style={{ background: "none", border: "none" }} onClick={start}>
          <Lottie options={recordingOptions} height={100} width={100} />
        </button>
      </FlexBox>
    </Container>
  );
}

export default Record;
