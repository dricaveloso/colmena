import { useContext } from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum, NotificationStatusEnum } from "@/enums/index";
import Section1 from "@/components/pages/home/Section1";
import Section2 from "@/components/pages/home/Section2";
import Section3 from "@/components/pages/home/Section3";
import Section4 from "@/components/pages/home/Section4";
import Divider from "@/components/ui/Divider";
import NotificationContext from "@/store/context/notification-context";
import { useTranslation } from "next-i18next";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["home"])),
  },
});

function Home() {
  const notificationCtx = useContext(NotificationContext);
  const { t: c } = useTranslation("common");
  const { t } = useTranslation("home");
  return (
    <LayoutApp title={t("welcomeTitle")} templateHeader="variation2">
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART} extraStyle={{ padding: 0, margin: 0 }}>
        <Section1 />
        <FlexBox
          justifyContent={JustifyContentEnum.FLEXSTART}
          extraStyle={{ paddingTop: 6, marginTop: 0 }}
        >
          <div
            onClick={() => [
              notificationCtx.showNotification({
                message: c("featureUnavailable"),
                status: NotificationStatusEnum.WARNING,
              }),
            ]}
          >
            <Section2 />
            <Divider marginTop={10} />
            <Section3 />
            <Divider marginTop={10} />
            <Section4 />
          </div>
        </FlexBox>
      </FlexBox>
    </LayoutApp>
  );
}

export default Home;
