import React from "react";
import FlexBox from "component/ui/FlexBox";
import IconButton from "component/ui/IconButton";
import LayoutApp from "component/statefull/LayoutApp";
import Divider from "component/ui/Divider";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "editAudio",
        "drawer",
        "common",
      ])),
    },
  };
};

function EditAudio() {
  const { t } = useTranslation("editAudio");

  return (
    <LayoutApp title={t("title")} back={true}>
      <FlexBox justifyContent="center">
        <p>{t("description")}</p>
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
              icon="play_circle_outline"
            />
            <IconButton fontSizeIcon="1.8em" color="black" icon="stop" />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <IconButton fontSizeIcon="1.4em" color="black" icon="fast_rewind" />
            <IconButton
              fontSizeIcon="1.4em"
              color="black"
              icon="fast_forward"
            />
          </div>
          <IconButton fontSizeIcon="1.4em" color="black" icon="crop" />
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default EditAudio;
