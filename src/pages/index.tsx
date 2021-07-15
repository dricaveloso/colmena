import React from "react";
import { Container, Button } from "@material-ui/core";
import Link from "next/link";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/index";
import CONSTANTS from "@/constants/index";
import Divider from "@/components/ui/Divider";

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
      <Text variant={TextVariantEnum.H4} gutterBottom>
        {CONSTANTS.APP_NAME}
      </Text>
      <Text variant={TextVariantEnum.BODY1} gutterBottom style={{ marginBottom: 20 }}>
        {CONSTANTS.APP_DESCRIPTION}
      </Text>
      <Link href="/home">
        <Button color="primary" variant="outlined">
          Home Flow
        </Button>
      </Link>
      <Divider marginTop={15} />
      <Link href="/invitation">
        <Button color="primary" variant="outlined">
          Invitation Flow
        </Button>
      </Link>
    </Container>
  );
}

export default Index;
