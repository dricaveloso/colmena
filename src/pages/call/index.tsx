import React from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import RecordUsers from "@/components/pages/record/RecordUsers";
import ShareLinkComponent from "@/components/pages/record/ShareLink";
import Timer from "@/components/pages/record/Timer";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { AlignItemsEnum, JustifyContentEnum } from "@/enums/index";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["call", "drawer", "common"])),
  },
});

function Call() {
  const router = useRouter();
  const { t } = useTranslation("call");

  return (
    <LayoutApp title={t("title")}>
      <FlexBox justifyContent={JustifyContentEnum.SPACEAROUND} alignItems={AlignItemsEnum.CENTER}>
        <ShareLinkComponent url="https://dev.maia.press/jghd-asde-erty" />
        <RecordUsers />
        <Timer redirectPage={() => router.push("/record-done")} />
      </FlexBox>
    </LayoutApp>
  );
}

export default Call;
