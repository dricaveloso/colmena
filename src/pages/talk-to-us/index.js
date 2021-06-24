import React from "react";
import FlexBox from "component/ui/FlexBox";
import IconButton from "component/ui/IconButton";
import Divider from "component/ui/Divider";
import LayoutApp from "component/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "talkToUs",
        "drawer",
        "common",
      ])),
    },
  };
};

function Profile(props) {
  const { t } = useTranslation("talkToUs");

  return (
    <LayoutApp title={t("title")} back={true}>
      <FlexBox justifyContent="center"></FlexBox>
    </LayoutApp>
  );
}

export default Profile;
