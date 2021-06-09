import React from "react";
import Container from "component/ui/Container";
import FlexBox from "component/ui/FlexBox";
import AppBar from "component/statefull/AppBar";

function LayoutApp({
  title,
  lang = "es",
  back = false,
  drawer = true,
  children,
}) {
  return (
    <Container extraStyle={{ padding: 0 }}>
      <FlexBox extraStyle={{ padding: 0 }}>
        <AppBar title={title} back={back} drawer={drawer} lang={lang} />
        {children}
      </FlexBox>
    </Container>
  );
}

export default LayoutApp;
