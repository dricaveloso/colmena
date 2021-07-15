import React from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import Timer from "@/components/pages/record/Timer";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { AlignItemsEnum, JustifyContentEnum } from "@/enums/index";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["recording", "drawer", "common"])),
  },
});

function Recording() {
  const router = useRouter();
  const { t } = useTranslation("recording");

  return (
    <LayoutApp title={t("title")}>
      <FlexBox justifyContent={JustifyContentEnum.CENTER} alignItems={AlignItemsEnum.CENTER}>
        <Timer redirectPage={() => router.push("/record-done")} />
      </FlexBox>
    </LayoutApp>
  );
}

export default Recording;
