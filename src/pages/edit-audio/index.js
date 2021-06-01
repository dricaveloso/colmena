import React from "react";
import Container from "component/ui/Container";
import FlexBox from "component/ui/FlexBox";
import AppBar from "component/statefull/AppBar";
import Image from "next/image";
import IconButton from "component/ui/IconButton";
import useTranslation from "hooks/useTranslation";

function EditAudio(props) {
  const { t } = useTranslation(props.lang, "editAudio");

  return (
    <Container extraStyle={{ padding: 0 }}>
      <FlexBox extraStyle={{ padding: 0 }}>
        <AppBar title={t?.title} />
        <p>{t?.description}</p>

        <Image
          src="/images/sound-waves.jpg"
          alt="Sound Waves images"
          width={500}
          height={250}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <IconButton
              fontSizeIcon="1.8em"
              color="black"
              icon="PlayCircleOutlineIcon"
            />
            <IconButton fontSizeIcon="1.8em" color="black" icon="StopIcon" />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <IconButton
              fontSizeIcon="1.4em"
              color="black"
              icon="FastRewindIcon"
            />
            <IconButton
              fontSizeIcon="1.4em"
              color="black"
              icon="FastForwardIcon"
            />
          </div>
          <IconButton fontSizeIcon="1.4em" color="black" icon="CropIcon" />
        </div>
      </FlexBox>
    </Container>
  );
}

export default EditAudio;
