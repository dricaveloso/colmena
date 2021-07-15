import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ResourceUnavailable from "@/components/ui/ResourceUnavailable";
import FullCenterContainer from "@/components/ui/FullCenterContainer";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

function MyLibrary() {
  const { t } = useTranslation("common");
  return (
    <FullCenterContainer>
      <ResourceUnavailable icon="construction" title={t("constructionPageText")} />
    </FullCenterContainer>
  );
}

export default MyLibrary;
