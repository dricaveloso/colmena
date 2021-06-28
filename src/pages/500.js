import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ResourceUnavailable from "component/ui/ResourceUnavailable";
import FullCenterContainer from "component/ui/FullCenterContainer";

export const getStaticProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale, ["common"])),
    },
  };
};

function PageNotFound() {
  const { t } = useTranslation("common");
  return (
    <FullCenterContainer>
      <ResourceUnavailable icon="error" title={t("internErrorPageText")} />
    </FullCenterContainer>
  );
}

export default PageNotFound;
