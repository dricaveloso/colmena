import React from "react";
import Container from "component/ui/Container";
import FlexBox from "component/ui/FlexBox";
import AppBar from "component/statefull/AppBar";
import FooterApp from "component/ui/FooterApp";

function LayoutApp({
  title,
  back = false,
  drawer = true,
  headerPosition = "fixed",
  children,
}) {
  return (
    <Container extraStyle={{ padding: 0 }}>
      <FlexBox extraStyle={{ padding: 0 }}>
        <AppBar
          title={title}
          back={back}
          headerPosition={headerPosition}
          drawer={drawer}
        />
        {children}
        <FooterApp />
      </FlexBox>
    </Container>
  );
}

export default LayoutApp;
