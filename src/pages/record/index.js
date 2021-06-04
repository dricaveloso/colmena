import React, { useState } from "react";
import FlexBox from "component/ui/FlexBox";
import useTranslation from "hooks/useTranslation";
import LayoutApp from "component/statefull/LayoutApp";
import RecordUsers from "component/pages/record/RecordUsers";
import ShareLinkComponent from "component/pages/record/ShareLink";
import Timer from "component/pages/record/Timer";
import { useRouter } from "next/router";

function Record(props) {
  const router = useRouter();
  const { t } = useTranslation(props.lang, "record");

  return (
    <LayoutApp title={t?.title} back={true} lang={props.lang}>
      <FlexBox justifyContent="space-between">
        <ShareLinkComponent
          title={t?.textInvite}
          titleShareLink={t?.titleShareLink}
          url="https://dev.maia.press/jghd-asde-erty"
        />
        <RecordUsers />
        <Timer redirectPage={() => router.push("/record-done")} />
      </FlexBox>
    </LayoutApp>
  );
}

export default Record;
