import React from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { AlignItemsEnum, JustifyContentEnum } from "@/enums/index";
import Recorder from "@/components/pages/recording/Recorder";
import WhiteSpaceFooter from "@/components/ui/WhiteSpaceFooter";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["recording", "drawer", "common"])),
  },
});

function Recording() {
  const { t } = useTranslation("recording");

  return (
    <LayoutApp title={t("title")}>
      <FlexBox justifyContent={JustifyContentEnum.CENTER} alignItems={AlignItemsEnum.CENTER}>
        <Recorder />
        <WhiteSpaceFooter />
      </FlexBox>
    </LayoutApp>
  );
}

export default Recording;
