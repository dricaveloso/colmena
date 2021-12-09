import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum } from "@/enums/index";
import { useTranslation } from "next-i18next";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import ResourceUnavailable from "@/components/ui/ResourceUnavailable";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["home"])),
  },
});

function Home() {
  const { t: c } = useTranslation("common");
  const { t } = useTranslation("home");
  return (
    <LayoutApp title={t("welcomeTitle")}>
      <FlexBox justifyContent={JustifyContentEnum.CENTER} extraStyle={{ padding: 0, margin: 0 }}>
        <ResourceUnavailable icon="construction" title={c("constructionPageText")} />
      </FlexBox>
    </LayoutApp>
  );
}

export default Home;
