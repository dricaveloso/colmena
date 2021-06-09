import React from "react";
import FlexBox from "component/ui/FlexBox";
import useTranslation from "hooks/useTranslation";
import IconButton from "component/ui/IconButton";
import { useRouter } from "next/router";
import LayoutApp from "component/statefull/LayoutApp";
import Divider from "@material-ui/core/Divider";

function About(props) {
  const router = useRouter();
  const fontSize = "2.1em";
  const fontSizeExtra = "1.9em";
  const color = "black";
  const { t } = useTranslation(props.lang, "intro");

  const items = [
    {
      icon: "PermDataSettingSharpIcon",
      text: t?.step1.description,
    },
    {
      icon: "WifiOffSharpIcon",
      text: t?.step2.description,
    },
    {
      icon: "CloudUploadSharpIcon",
      text: t?.step3.description,
    },
    {
      icon: "SupervisedUserCircleSharpIcon",
      text: t?.step4.description,
    },
  ];
  const extraItems = [
    {
      icon: "SupervisedUserCircleIcon",
      text: t?.communityTitle,
    },
    {
      icon: "LibraryMusicIcon",
      text: "Mediateca",
      handleClick: () => router.push("/mediateca"),
    },
  ];

  return (
    <LayoutApp title={t?.aboutTitle} lang={props.lang} back={true}>
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
