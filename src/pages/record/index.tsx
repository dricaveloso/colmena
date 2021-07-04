import React from "react";
import FlexBox from "component/ui/FlexBox";
import LayoutApp from "component/statefull/LayoutApp";
import RecordUsers from "component/pages/record/RecordUsers";
import ShareLinkComponent from "component/pages/record/ShareLink";
import Timer from "component/pages/record/Timer";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "interfaces";
import { JustifyContentEnum } from "enums";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["record", "drawer", "common"])),
  },
});

function Record() {
  const router = useRouter();
  const { t } = useTranslation("record");

  return (
    <LayoutApp title={t("title")} back>
      <FlexBox justifyContent={JustifyContentEnum.SPACEAROUND}>
        <ShareLinkComponent url="https://dev.maia.press/jghd-asde-erty" />
        <RecordUsers />
        <Timer redirectPage={() => router.push("/record-done")} />
      </FlexBox>
    </LayoutApp>
  );
}

export default Record;
