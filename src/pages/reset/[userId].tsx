import React from "react";
import Container from "@/components/ui/Container";
import Box from "@material-ui/core/Box";
import Divider from "@/components/ui/Divider";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps, GetStaticPaths } from "next";
import { I18nInterface } from "@/interfaces/index";
import { TextVariantEnum } from "@/enums/index";
import Text from "@/components/ui/Text";
import Form from "@/components/pages/reset/Form";
import { useRouter } from "next/router";
import ExternalVerticalLogo from "@/components/ui/ExternalVerticalLogo";
import FooterDW from "@/components/ui/FooterDW";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["reset", "common"])),
  },
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default function UpdatePassword() {
  const { t } = useTranslation("reset");
  const router = useRouter();
  const { userId } = router.query;

  if (!userId) {
    router.replace("/login");
    return null;
  }

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
        <Text variant={TextVariantEnum.BODY2} style={{ marginTop: 20, textAlign: "center" }}>
          {t("title")}
        </Text>
        <Divider />
        <Form userId={Array.isArray(userId) ? userId[0] : userId} />
      </Box>
      <FooterDW />
    </Container>
  );
}
