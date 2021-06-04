import React from "react";
import FlexBox from "component/ui/FlexBox";
import { useRouter } from "next/router";
import Box from "@material-ui/core/Box";
import Box100 from "component/ui/Box100";
import Typography from "@material-ui/core/Typography";
import Divider from "component/ui/Divider";
import TextField from "component/ui/TextField";
import Button from "component/ui/Button";
import useTranslation from "hooks/useTranslation";
import LayoutApp from "component/statefull/LayoutApp";

function Invite(props) {
  const { t } = useTranslation(props.lang, "invite");

  return (
    <LayoutApp title={t?.title} back={true} drawer={false}>
      <FlexBox justifyContent="center">
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
            <Button title={t?.submitTextButton} handleClick={() => {}} />
          </Box>
        </Box>
      </FlexBox>
    </LayoutApp>
  );
}

export default Invite;
