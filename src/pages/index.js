import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

function Index() {
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
      <Typography variant="h4" component="h3" gutterBottom>
        MAIA
      </Typography>
      <Typography variant="p" gutterBottom>
        Media Asset for Independent Associations
      </Typography>
    </Container>
  );
}

export default Index;
