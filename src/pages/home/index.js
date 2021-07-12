import { useState, useEffect } from "react";
import FlexBox from "component/ui/FlexBox";
import LayoutApp from "component/statefull/LayoutApp";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DashboardActions from "component/pages/home/DashboardActions";
import Greeting from "component/pages/home/Greeting";

export const getStaticProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale, [
        "home",
        "drawer",
        "common",
      ])),
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
    <LayoutApp title="Colmena" back={true}>
      {showGreeting && !showContent ? (
        <FlexBox justifyContent="center">
          <Greeting showGreeting={showGreeting} />
        </FlexBox>
      ) : (
        showContent && (
          <FlexBox justifyContent="flex-start">
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
