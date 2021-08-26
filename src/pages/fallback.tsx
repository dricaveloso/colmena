import React from "react";
import FullCenterContainer from "@/components/ui/FullCenterContainer";
// import { useTranslation } from "next-i18next";
// import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ResourceUnavailable from "@/components/ui/ResourceUnavailable";
// import Image from "next/image";
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
      {/* <Image src="/images/fallback.png" width={100} height={140} /> */}
    </FullCenterContainer>
  );
}

export default Fallback;
