import React from "react";
import FlexBox from "component/ui/FlexBox";
import IconButton from "component/ui/IconButton";
import Divider from "component/ui/Divider";
import LayoutApp from "component/statefull/LayoutApp";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "interfaces";
import { JustifyContentEnum, TextVariantEnum } from "enums";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["recordDone", "drawer", "common"])),
  },
});

function RecordDone() {
  const router = useRouter();
  const { t } = useTranslation("recordDone");

  const navigate = (url: string) => {
    router.push(url);
  };

  return (
    <LayoutApp title={t("title")}>
      <FlexBox justifyContent={JustifyContentEnum.CENTER}>
        <div>
          <p>{t("description")}</p>
          <Divider marginBottom={20} />
          <IconButton
            title={t("textEditButton")}
            icon="graphic_eq"
            variantTitle={TextVariantEnum.BODY2}
            fontSizeIcon="1.8em"
            handleClick={() => navigate("/edit-audio")}
          />
          <Divider marginBottom={20} />
          <IconButton
            title={t("textShareButton")}
            icon="share"
            variantTitle={TextVariantEnum.BODY2}
            fontSizeIcon="1.8em"
            handleClick={() => navigate("/share-audio")}
          />
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default RecordDone;
