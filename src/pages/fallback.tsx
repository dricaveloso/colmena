import React from "react";
import FullCenterContainer from "component/ui/FullCenterContainer";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ResourceUnavailable from "component/ui/ResourceUnavailable";

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

function Fallback() {
  const { t } = useTranslation("common");

  return (
    <FullCenterContainer>
      <ResourceUnavailable icon="wifi_off" title={t("messageOffline")} />
    </FullCenterContainer>
  );
}

export default Fallback;
