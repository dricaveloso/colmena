import React, { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import Box from "@material-ui/core/Box";
import Divider from "@/components/ui/Divider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import Form from "@/components/pages/login/Form";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import CenterProgress from "@/components/ui/CenterProgress";
import ExternalVerticalLogo from "@/components/ui/ExternalVerticalLogo";
import FooterDW from "@/components/ui/FooterDW";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["login", "common"])),
  },
});

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.onLine) {
      router.replace("/home");
      return;
    }
    getSession().then((session) => {
      if (session) {
        router.replace("/home");
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  if (isLoading) return <CenterProgress />;

  return (
    <Container>
      <Box
        className="width-based-device"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        display="flex"
      >
        <ExternalVerticalLogo />
        <Divider marginTop={24} />
        <Form />
      </Box>
      <FooterDW />
    </Container>
  );
}
