import React from "react";
import Container from "@/components/ui/Container";
import Box from "@material-ui/core/Box";
import Divider from "@/components/ui/Divider";
import { useTranslation } from "next-i18next";
import { GetStaticProps, GetStaticPaths } from "next";
import { I18nInterface } from "@/interfaces/index";
import { TextVariantEnum } from "@/enums/index";
import Text from "@/components/ui/Text";
import Form from "@/components/pages/reset/Form";
import { useRouter } from "next/router";
import ExternalVerticalLogo from "@/components/ui/ExternalVerticalLogo";
import FooterDW from "@/components/ui/FooterDW";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import theme from "@/styles/theme";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["reset"])),
  },
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default function UpdatePassword() {
  const { t } = useTranslation("reset");
  const router = useRouter();
  const { params } = router.query;

  if (!Array.isArray(params)) {
    router.replace("/login");
    return null;
  }

  const userId = params[0];
  const type = params[1];

  if (!userId) {
    router.replace("/login");
    return null;
  }

  const backgroundColor = theme.palette.primary.main;
  return (
    <Container backgroundColor={backgroundColor}>
      <Box
        className="width-based-device"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        display="flex"
      >
        <ExternalVerticalLogo />
        <Divider marginTop={24} />
        <Text variant={TextVariantEnum.BODY2} style={{ color: "#fff", textAlign: "center" }}>
          {t(`${type === "create" ? "titleCreated" : "titleUpdated"}`)}
        </Text>
        <Divider marginTop={24} />
        <Form userId={Array.isArray(userId) ? userId[0] : userId} type={type} />
      </Box>
      <FooterDW />
    </Container>
  );
}
