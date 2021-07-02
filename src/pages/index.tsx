import React from "react";
import { Container, Button } from "@material-ui/core";
import Link from "next/link";
import Text from "component/ui/Text";
import { TextVariantEnum } from "enums";

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
      <Text variant={TextVariantEnum.H4} gutterBottom={true}>
        MAIA
      </Text>
      <Text
        variant={TextVariantEnum.BODY1}
        gutterBottom={true}
        style={{ marginBottom: 20 }}
      >
        Create, Collaborate and Share
      </Text>
      <Link href="/invitation">
        <Button color="primary" variant="outlined">
          Demo
        </Button>
      </Link>
    </Container>
  );
}

export default Index;
