import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ResourceUnavailable from "component/ui/ResourceUnavailable";
import FullCenterContainer from "component/ui/FullCenterContainer";
import { GetStaticProps } from "next";
import { I18nInterface } from "interfaces";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

function PageNotFound() {
  const { t } = useTranslation("common");
  return (
    <FullCenterContainer>
      <ResourceUnavailable icon="error_outline" title={t("notFoundPageText")} />
    </FullCenterContainer>
  );
}

export default PageNotFound;
