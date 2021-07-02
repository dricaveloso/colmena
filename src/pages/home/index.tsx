import { useState, useEffect } from "react";
import FlexBox from "component/ui/FlexBox";
import LayoutApp from "component/statefull/LayoutApp";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DashboardActions from "component/pages/home/DashboardActions";
import Greeting from "component/pages/home/Greeting";
import { GetStaticProps } from "next";
import { I18nInterface } from "interfaces";
import { JustifyContentEnum } from "enums";

export const getStaticProps: GetStaticProps = async ({
  locale,
}: I18nInterface) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["home", "drawer", "common"])),
    },
  };
};

function Home() {
  const [showGreeting, setShowGreeting] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (
      !localStorage.getItem("isFirstAccess") ||
      localStorage.getItem("isFirstAccess") == "yes"
    ) {
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
    <LayoutApp title="MAIA" back={true}>
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
                localStorage.getItem("isFirstAccess") == "yes"
              }
            />
          </FlexBox>
        )
      )}
    </LayoutApp>
  );
}

export default Home;
