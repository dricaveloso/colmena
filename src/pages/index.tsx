import React from "react";
import { Container, Button } from "@material-ui/core";
import Link from "next/link";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/index";
import CONSTANTS from "@/constants/index";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { I18nInterface } from "@/interfaces/index";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

function Index() {
  const { t } = useTranslation("common");

  return (
    <Container
      style={{
        height: "100vh",
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Text variant={TextVariantEnum.H4} gutterBottom>
        {CONSTANTS.APP_NAME}
      </Text>
      <Text
        variant={TextVariantEnum.BODY1}
        gutterBottom
        style={{ marginBottom: 20, textAlign: "center" }}
      >
        {CONSTANTS.APP_DESCRIPTION}
      </Text>
      <Link href="/login">
        <Button color="primary" variant="outlined">
          {t("enterTitleIndexPage")}
        </Button>
      </Link>
    </Container>
  );
}

export default Index;
