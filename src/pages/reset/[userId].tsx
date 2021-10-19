import React from "react";
import Container from "@/components/ui/Container";
import FooterApp from "@/components/layout/FooterApp";
import HeaderApp from "@/components/layout/HeaderApp";
import FlexBox from "@/components/ui/FlexBox";
import Box from "@material-ui/core/Box";
import Divider from "@/components/ui/Divider";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps, GetStaticPaths } from "next";
import { I18nInterface } from "@/interfaces/index";
import { TextVariantEnum } from "@/enums/index";
import Text from "@/components/ui/Text";
import Form from "@/components/pages/update-password/Form";
import { useRouter } from "next/router";

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
      <FlexBox>
        <HeaderApp />
        <Box className="width-based-device" flexDirection="column" display="flex">
          <Text variant={TextVariantEnum.BODY2}>{t("title")}</Text>
          <Divider />
          <Form userId={Array.isArray(userId) ? userId[0] : userId} />
        </Box>
        <FooterApp about={false} terms={false} />
      </FlexBox>
    </Container>
  );
}
