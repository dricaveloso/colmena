import React from "react";
import Container from "@material-ui/core/Container";
import { SizeScreensProps } from "@/types/index";
import { SizeScreensEnum } from "@/enums/index";

import { currentDirection } from "@/utils/i18n";

import { create } from "jss";
import rtl from "jss-rtl";
import { StylesProvider, jssPreset } from "@material-ui/core/styles";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

type Props = {
  maxWidth?: SizeScreensProps | false;
  children: React.ReactNode;
  justifyContent?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  extraStyle?: object;
  // eslint-disable-next-line @typescript-eslint/ban-types
  backgroundImage?: object;
  backgroundColor?: string;
};

export default function Ctnr({
  justifyContent = "center",
  maxWidth = SizeScreensEnum.XL,
  children,
  extraStyle = {},
  backgroundColor = "#fff",
  backgroundImage = {},
}: Props) {
  return (
    <Container
      dir={currentDirection()}
      maxWidth={maxWidth}
      style={{
        display: "flex",
        flex: 1,
        justifyContent,
        height: "100vh",
        backgroundColor,
        ...extraStyle,
        ...backgroundImage,
      }}
    >
      <StylesProvider jss={jss}>{children}</StylesProvider>
    </Container>
  );
}
