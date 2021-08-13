import React from "react";
import FullCenterContainer from "@/components/ui/FullCenterContainer";
// import { useTranslation } from "next-i18next";
// import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ResourceUnavailable from "@/components/ui/ResourceUnavailable";
// import { GetStaticProps } from "next";
// import { I18nInterface } from "@/interfaces/index";

// export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
//   props: {
//     ...(await serverSideTranslations(locale, ["common"])),
//   },
// });

function Fallback() {
  // const { t } = useTranslation("common");

  return (
    <FullCenterContainer>
      <ResourceUnavailable icon="wifi_off" />
    </FullCenterContainer>
  );
}

export default Fallback;
