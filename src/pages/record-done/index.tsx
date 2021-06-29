import React from "react";
import FlexBox from "component/ui/FlexBox";
import IconButton from "component/ui/IconButton";
import Divider from "component/ui/Divider";
import LayoutApp from "component/statefull/LayoutApp";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "recordDone",
        "drawer",
        "common",
      ])),
    },
  };
};

function RecordDone() {
  const router = useRouter();
  const { t } = useTranslation("recordDone");

  return (
    <LayoutApp title={t("title")}>
      <FlexBox justifyContent="center">
        <div>
          <p>{t("description")}</p>
          <Divider marginBottom={20} />
          <IconButton
            title={t("textEditButton")}
            icon="graphic_eq"
            variantTitle="p"
            fontSizeIcon="1.8em"
            handleClick={() => router.push("/edit-audio")}
          />
          <Divider marginBottom={20} />
          <IconButton
            title={t("textShareButton")}
            icon="share"
            variantTitle="p"
            fontSizeIcon="1.8em"
            handleClick={() => router.push("/share-audio")}
          />
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default RecordDone;
