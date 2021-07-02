import React from "react";
import Container from "component/ui/Container";
import FlexBox from "component/ui/FlexBox";
import AppBar from "component/statefull/AppBar";
import FooterApp from "component/ui/FooterApp";
import { PositionProps } from "types";
import { PositionEnum } from "enums";

type Props = {
  title: string;
  back?: boolean;
  drawer?: boolean;
  headerPosition?: PositionProps | undefined;
  children: React.ReactNode;
};

function LayoutApp({
  title,
  back = false,
  drawer = true,
  headerPosition = PositionEnum.FIXED,
  children,
}: Props) {
  return (
    <Container extraStyle={{ padding: 0 }}>
      <FlexBox extraStyle={{ padding: 0 }}>
        <AppBar
          title={title}
          back={back}
          headerPosition={headerPosition}
          drawer={drawer}
        />
        <>{children}</>
        <FooterApp />
      </FlexBox>
    </Container>
  );
}

export default LayoutApp;
