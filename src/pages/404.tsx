import React from "react";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import ResourceUnavailable from "@/components/ui/ResourceUnavailable";
import FullCenterContainer from "@/components/ui/FullCenterContainer";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, [])),
  },
});

function PageNotFound() {
  return (
    <FullCenterContainer>
      <ResourceUnavailable icon="error_outline" title="404" />
    </FullCenterContainer>
  );
}

export default PageNotFound;
