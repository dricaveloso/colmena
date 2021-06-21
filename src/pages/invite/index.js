import React, { useState } from "react";
import FlexBox from "component/ui/FlexBox";
import { Box, Typography } from "@material-ui/core";
import Box100 from "component/ui/Box100";
import Divider from "component/ui/Divider";
import TextField from "component/ui/TextField";
import Button from "component/ui/Button";
import LayoutApp from "component/statefull/LayoutApp";
import Alert from "component/ui/Alert";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["invite", "drawer"])),
    },
  };
};

function Invite() {
  const { t } = useTranslation("invite");
  const [openAlert, setOpenAlert] = useState(false);

  return (
    <LayoutApp title={t("title")} back={true}>
      <FlexBox justifyContent="center">
        <Box my={4} style={{ textAlign: "center", padding: 35 }}>
          <Typography component="p" gutterBottom>
            {t("title")}
          </Typography>
          <Divider />
          <Box>
            <Box100>
              <TextField
                label={t("emailPlaceholder")}
                variant="outlined"
                id="name"
              />
            </Box100>
          </Box>
          <Divider marginTop={40} />
          <Box style={{ display: "flex", flexDirection: "column" }}>
            <Button
              title={t("submitTextButton")}
              handleClick={() => setOpenAlert(true)}
            />
          </Box>
        </Box>
        <Alert type="success" open={openAlert} title={t("successText")} />
      </FlexBox>
    </LayoutApp>
  );
}

export default Invite;
