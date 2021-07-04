import React from "react";
import FlexBox from "component/ui/FlexBox";
import LayoutApp from "component/statefull/LayoutApp";
import Divider from "component/ui/Divider";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "interfaces";
import { JustifyContentEnum } from "enums";
import MaterialIcon from "component/ui/MaterialIcon";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["editAudio", "drawer", "common"])),
  },
});

function EditAudio() {
  const { t } = useTranslation("editAudio");

  return (
    <LayoutApp title={t("title")} back>
      <FlexBox justifyContent={JustifyContentEnum.CENTER}>
        <p>{t("description")}</p>
        <Divider marginBottom={10} />
        <img src="/images/sound-waves.jpg" alt="Sound Waves images" width="100%" />
        <Divider marginBottom={10} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
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
            <MaterialIcon
              icon="play_circle_outline"
              style={{ fontSize: "3.4em", color: "black" }}
            />
            <MaterialIcon icon="stop" style={{ fontSize: "3.4em", color: "black" }} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <MaterialIcon icon="fast_rewind" style={{ fontSize: "2.3em", color: "black" }} />
            <MaterialIcon icon="fast_forward" style={{ fontSize: "2.3em", color: "black" }} />
          </div>
          <MaterialIcon icon="crop" style={{ fontSize: "1.8em", color: "black" }} />
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default EditAudio;
