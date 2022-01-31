import React from "react";
import Container from "@/components/ui/Container";
import Box from "@material-ui/core/Box";
import Divider from "@/components/ui/Divider";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import Form from "@/components/pages/forgot-password/Form";
import ExternalVerticalLogo from "@/components/ui/ExternalVerticalLogo";
import FooterDW from "@/components/ui/FooterDW";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import theme from "@/styles/theme";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["login"])),
  },
});

const backgroundColor = theme.palette.primary.main;
export default function ForgotPassword() {
  return (
    <Container backgroundColor={backgroundColor}>
      <Box
        className="width-based-device"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        display="flex"
        style={{ backgroundColor }}
      >
        <ExternalVerticalLogo />
        <Divider marginTop={35} />
        <Form />
      </Box>
      <FooterDW />
    </Container>
  );
}
