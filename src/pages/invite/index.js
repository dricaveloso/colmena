import React from "react";
import Container from "component/ui/Container";
import FlexBox from "component/ui/FlexBox";
import AppBar from "component/statefull/AppBar";
import FooterApp from "component/layout/FooterApp";
import { useRouter } from "next/router";
import Box from "@material-ui/core/Box";
import Box100 from "component/ui/Box100";
import Typography from "@material-ui/core/Typography";
import Divider from "component/ui/Divider";
import TextField from "component/ui/TextField";
import Button from "component/ui/Button";
import useTranslation from "hooks/useTranslation";

function Invite(props) {
  const router = useRouter();
  const { t } = useTranslation(props.lang, "invite");

  return (
    <Container extraStyle={{ padding: 0 }}>
      <FlexBox extraStyle={{ padding: 0 }}>
        <AppBar title="MAIA" />
        <Box my={4} style={{ textAlign: "center", padding: 35 }}>
          <Typography component="p" gutterBottom>
            {t?.title}
          </Typography>
          <Divider />
          <Box>
            <Box100>
              <TextField
                label={t?.emailPlaceholder}
                variant="outlined"
                id="name"
              />
            </Box100>
          </Box>
          <Divider marginTop={40} />
          <Box style={{ display: "flex", flexDirection: "column" }}>
            <Button
              title={t?.submitTextButton}
              handleClick={() => router.push("/dashboard")}
            />
          </Box>
        </Box>
        <FooterApp about={true} terms={true} lang={props.lang} />
      </FlexBox>
    </Container>
  );
}

export default Invite;
