import React, { useState } from "react";
import FlexBox from "component/ui/FlexBox";
import LayoutApp from "component/statefull/LayoutApp";
import RecordUsers from "component/pages/record/RecordUsers";
import ShareLinkComponent from "component/pages/record/ShareLink";
import Timer from "component/pages/record/Timer";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["record", "drawer"])),
    },
  };
};

function Record() {
  const router = useRouter();
  const { t } = useTranslation("record");

  return (
    <LayoutApp title={t("title")} back={true}>
      <FlexBox justifyContent="space-around">
        <ShareLinkComponent url="https://dev.maia.press/jghd-asde-erty" />
        <RecordUsers />
        <Timer redirectPage={() => router.push("/record-done")} />
      </FlexBox>
    </LayoutApp>
  );
}

export default Record;
