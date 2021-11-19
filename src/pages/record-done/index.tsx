import React from "react";
import FlexBox from "@/components/ui/FlexBox";
import IconButton from "@/components/ui/IconButton";
import Divider from "@/components/ui/Divider";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum, TextVariantEnum } from "@/enums/index";

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
            icon="edit"
            variantTitle={TextVariantEnum.BODY2}
            fontSizeIcon="large"
            handleClick={() => navigate("/edit-audio")}
          />
          <Divider marginBottom={20} />
          <IconButton
            title={t("textShareButton")}
            icon="share"
            variantTitle={TextVariantEnum.BODY2}
            fontSizeIcon="large"
            handleClick={() => navigate("/share-audio")}
          />
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default RecordDone;
