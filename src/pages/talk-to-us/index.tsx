import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ResourceUnavailable from "component/ui/ResourceUnavailable";
import FullCenterContainer from "component/ui/FullCenterContainer";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale, ["common"])),
    },
  };
};

function TalkToUs() {
  const { t } = useTranslation("common");
  return (
    <FullCenterContainer>
      <ResourceUnavailable
        icon="construction"
        title={t("constructionPageText")}
      />
    </FullCenterContainer>
  );
}

export default TalkToUs;
