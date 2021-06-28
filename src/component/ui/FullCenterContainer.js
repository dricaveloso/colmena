import React from "react";
import Container from "@material-ui/core/Container";

function FullCenterContainer({ children }) {
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
      {children}
    </Container>
  );
}

export default FullCenterContainer;
