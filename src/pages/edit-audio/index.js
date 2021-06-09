import React from "react";
import FlexBox from "component/ui/FlexBox";
import IconButton from "component/ui/IconButton";
import LayoutApp from "component/statefull/LayoutApp";
import useTranslation from "hooks/useTranslation";
import Divider from "component/ui/Divider";

function EditAudio(props) {
  const { t } = useTranslation(props.lang, "editAudio");

  return (
    <LayoutApp title={t?.title} back={true}>
      <FlexBox justifyContent="center">
        <p>{t?.description}</p>
        <Divider marginBottom={10} />
        <img
          src="/images/sound-waves.jpg"
          alt="Sound Waves images"
          width="100%"
        />
        <Divider marginBottom={10} />
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
    </LayoutApp>
  );
}

export default EditAudio;
