import { useState, useEffect } from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DashboardActions from "@/components/pages/home/DashboardActions";
import Greeting from "@/components/pages/home/Greeting";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum } from "@/enums/index";
import WhiteSpaceFooter from "@/components/ui/WhiteSpaceFooter";
import CONSTANTS from "@/constants/index";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["home", "drawer", "common"])),
  },
});

function Home() {
  const [showGreeting, setShowGreeting] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("isFirstAccess") || localStorage.getItem("isFirstAccess") === "yes") {
      setTimeout(() => {
        setShowGreeting(true);
      }, 200);
      setTimeout(() => {
        setShowGreeting(false);
        setShowContent(true);
        localStorage.setItem("isFirstAccess", "no");
      }, 3000);
    } else {
      setShowGreeting(false);
      setShowContent(true);
    }
  }, []);

  return (
    <LayoutApp title={CONSTANTS.APP_NAME} templateHeader="variation2">
      {showGreeting && !showContent ? (
        <FlexBox justifyContent={JustifyContentEnum.CENTER}>
          <Greeting showGreeting={showGreeting} />
        </FlexBox>
      ) : (
        showContent && (
          <FlexBox justifyContent={JustifyContentEnum.FLEXSTART}>
            <DashboardActions
              showContent={showContent}
              isFirstAccess={
                !localStorage.getItem("isFirstAccess") ||
                localStorage.getItem("isFirstAccess") === "yes"
              }
            />
            <WhiteSpaceFooter />
          </FlexBox>
        )
      )}
    </LayoutApp>
  );
}

export default Home;
