import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "next/link";
import { useRouter } from "next/router";

function Fallback() {
  const router = useRouter();

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
        Offline page
      </Typography>
      <Typography variant="p" gutterBottom style={{ marginBottom: 40 }}>
        Please access this page, at least once, with Internet enable.
      </Typography>
      <Link href="/invitation">
        <Button
          color="primary"
          variant="outlined"
          onClick={() => router.back()}
        >
          Voltar
        </Button>
      </Link>
    </Container>
  );
}

export default Fallback;
