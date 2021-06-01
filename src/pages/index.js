import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "next/link";

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
      <Typography variant="p" gutterBottom style={{ marginBottom: 40 }}>
        Media Asset for Independent Associations
      </Typography>
      <Link href="/invitation">
        <Button color="primary" variant="outlined">
          Invitation
        </Button>
      </Link>
    </Container>
  );
}

export default Index;
