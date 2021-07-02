import React from "react";
import Container from "@material-ui/core/Container";

type Props = {
  children: React.ReactNode;
};

function FullCenterContainer({ children }: Props) {
  return (
    <Container
      style={{
        height: "100vh",
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <>{children}</>
    </Container>
  );
}

export default FullCenterContainer;
