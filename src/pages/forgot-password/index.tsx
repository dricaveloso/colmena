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

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["login"])),
  },
});

export default function ForgotPassword() {
  return (
    <Container>
      <Box
        className="width-based-device"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        display="flex"
        style={{ backgroundColor: "#fff" }}
      >
        <ExternalVerticalLogo />
        <Divider marginTop={24} />
        <Form />
      </Box>
      <FooterDW />
    </Container>
  );
}
