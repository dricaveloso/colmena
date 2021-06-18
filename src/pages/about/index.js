import React from "react";
import FlexBox from "component/ui/FlexBox";
import IconButton from "component/ui/IconButton";
import { useRouter } from "next/router";
import LayoutApp from "component/statefull/LayoutApp";
import Divider from "@material-ui/core/Divider";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["intro", "drawer"])),
    },
  };
};

function About(props) {
  const router = useRouter();
  const fontSize = "2.1em";
  const fontSizeExtra = "1.9em";
  const color = "black";
  const { t } = useTranslation("intro");

  const items = [
    {
      icon: "perm_data_setting_sharp",
      text: t("step1.description"),
    },
    {
      icon: "wifi_off_sharp",
      text: t("step2.description"),
    },
    {
      icon: "cloud_upload_sharp",
      text: t("step3.description"),
    },
    {
      icon: "supervised_user_circle_sharp",
      text: t("step4.description"),
    },
  ];
  const extraItems = [
    {
      icon: "supervised_user_circle",
      text: t("communityTitle"),
    },
    {
      icon: "library_music",
      text: "Mediateca",
      handleClick: () => router.push("/mediateca"),
    },
  ];

  return (
    <LayoutApp title={t("aboutTitle")} back={true}>
      <FlexBox>
        <div
          style={{
            display: "inline-grid",
            gridTemplateColumns: "auto auto",
            gridColumnGap: "50px",
          }}
        >
          {items.map(({ icon, text }) => (
            <FlexBox
              justifyContent="flex-start"
              extraStyle={{
                alignItems: "center",
              }}
            >
              <IconButton fontSizeIcon={fontSize} color={color} icon={icon} />

              <p
                style={{
                  fontSize: "12px",
                  display: "flex",
                  alignSelf: "",
                }}
              >
                {text}
              </p>
            </FlexBox>
          ))}
        </div>
        <Divider />
        <div
          style={{
            display: "inline-grid",
            gridTemplateColumns: "auto auto",
            gridColumnGap: "50px",
          }}
        >
          {extraItems.map(({ icon, text, handleClick = null }) => (
            <FlexBox
              extraStyle={{ alignItems: "center" }}
              justifyContent="center"
            >
              <IconButton
                fontSizeIcon={fontSizeExtra}
                color={color}
                icon={icon}
                handleClick={handleClick}
              />
              <p style={{ fontSize: "12px" }}>{text}</p>
            </FlexBox>
          ))}
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default About;
