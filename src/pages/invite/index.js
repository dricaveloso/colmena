import React, { useState } from "react";
import FlexBox from "component/ui/FlexBox";
import Box from "@material-ui/core/Box";
import Box100 from "component/ui/Box100";
import Typography from "@material-ui/core/Typography";
import Divider from "component/ui/Divider";
import TextField from "component/ui/TextField";
import Button from "component/ui/Button";
import useTranslation from "hooks/useTranslation";
import LayoutApp from "component/statefull/LayoutApp";
import Alert from "component/ui/Alert";

function Invite(props) {
  const { t } = useTranslation(props.lang, "invite");
  const [openAlert, setOpenAlert] = useState(false);

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
            <Button
              title={t?.submitTextButton}
              handleClick={() => setOpenAlert(true)}
            />
          </Box>
        </Box>
        <Alert type="success" open={openAlert} title={t?.successText} />
      </FlexBox>
    </LayoutApp>
  );
}

export default Invite;
