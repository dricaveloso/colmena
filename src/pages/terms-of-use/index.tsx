import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { TextAlignEnum, TextVariantEnum } from "@/enums/index";
import Text from "@/components/ui/Text";
import WhiteSpaceFooter from "@/components/ui/WhiteSpaceFooter";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["intro", "drawer", "common"])),
  },
});

function TermsOfUse() {
  const { t } = useTranslation("common");
  return (
    <LayoutApp title={t("termsOfUse")} back>
      <FlexBox>
        <Text variant={TextVariantEnum.BODY1} align={TextAlignEnum.JUSTIFY}>
          {t("termsOfUseText")}
        </Text>
      </FlexBox>
      <WhiteSpaceFooter />
    </LayoutApp>
  );
}

export default TermsOfUse;
