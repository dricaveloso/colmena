/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import AwesomeSlider from "react-awesome-slider";
// @ts-ignore
import withAutoplay from "react-awesome-slider/dist/autoplay";
import { AllIconProps } from "@/types/index";

import "react-awesome-slider/dist/styles.css";
import theme from "@/styles/theme";
import SvgIcon from "@/components/ui/SvgIcon";
import Text from "@/components/ui/Text";
import { Grid } from "@material-ui/core";
import { useTranslation } from "next-i18next";

const AutoplaySlider = withAutoplay(AwesomeSlider);

interface IContent {
  text: string;
  iconName: AllIconProps;
}

const Content: React.FC<IContent> = ({ iconName, text }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      padding: "10px",
    }}
  >
    <SvgIcon icon={iconName} htmlColor="#fff" />
    <Text
      style={{
        fontSize: "12px",
        width: "272px",
        marginLeft: "10px",
      }}
    >
      {text}
    </Text>
  </div>
);

const Carousel = () => {
  const { t } = useTranslation("common");
  return (
    <AutoplaySlider
      play
      bullets={false}
      className="ui-carousel"
      transitionDelay={4000}
      organicArrows={false}
    >
      <Grid
        style={{
          backgroundColor: theme.palette.variation1.main,
          height: "85px",
          color: "#fff",
        }}
      >
        <Content iconName="banner_1" text={t("bannerMessage1")} />
      </Grid>
      <Grid
        style={{
          backgroundColor: theme.palette.secondary.main,
          height: "85px",
          color: "#fff",
        }}
      >
        <Content iconName="banner_2" text={t("bannerMessage2")} />
      </Grid>
      <Grid
        style={{
          backgroundColor: theme.palette.variation5.main,
          height: "85px",
          color: "#fff",
        }}
      >
        <Content iconName="banner_3" text={t("bannerMessage3")} />
      </Grid>
      <Grid
        style={{
          backgroundColor: theme.palette.variation2.main,
          height: "85px",
          color: "#fff",
        }}
      >
        <Content iconName="banner_4" text={t("bannerMessage4")} />
      </Grid>
    </AutoplaySlider>
  );
};

export default Carousel;
