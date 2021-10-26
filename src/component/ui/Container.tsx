import React from "react";
import Container from "@material-ui/core/Container";
import { SizeScreensProps } from "@/types/index";
import { SizeScreensEnum } from "@/enums/index";

type Props = {
  maxWidth?: SizeScreensProps | false;
  children: React.ReactNode;
  justifyContent?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  extraStyle?: object;
};

export default function Ctnr({
  justifyContent = "center",
  maxWidth = SizeScreensEnum.LG,
  children,
  extraStyle = {},
}: Props) {
  return (
    <Container
      maxWidth={maxWidth}
      style={{
        display: "flex",
        flex: 1,
        justifyContent,
        height: "100vh",
        backgroundColor: "#F9F9F9",
        ...extraStyle,
      }}
    >
      <>{children}</>
    </Container>
  );
}
