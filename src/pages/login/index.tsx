import React from "react";
import Container from "@/components/ui/Container";
import FooterApp from "@/components/layout/FooterApp";
import HeaderApp from "@/components/layout/HeaderApp";
import FlexBox from "@/components/ui/FlexBox";
import Box from "@material-ui/core/Box";
import Divider from "@/components/ui/Divider";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { TextVariantEnum } from "@/enums/index";
import Text from "@/components/ui/Text";
import Form from "@/components/pages/login/Form";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["login", "common"])),
  },
});

export default function Login() {
  const { t } = useTranslation("login");

  return (
    <Container>
      <FlexBox>
        <HeaderApp />
        <Box className="width-based-device" flexDirection="column" display="flex">
          <Text variant={TextVariantEnum.BODY2}>{t("title")}</Text>
          <Divider />
          <Form />
        </Box>
        <FooterApp about={false} terms={false} />
      </FlexBox>
    </Container>
  );
}
