import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum } from "@/enums/index";
import { useTranslation } from "next-i18next";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
// import ResourceUnavailable from "@/components/ui/ResourceUnavailable";
import RecentFiles from "@/components/pages/home/RecentFiles";
import { PropsLibrarySelector, PropsUserSelector } from "@/types/*";
import { useSelector } from "react-redux";
import FilesInfoSection from "@/components/pages/home/FilesInfo";
import HoneyCombsList from "@/components/pages/home/Section3";
import SliderQuota from "@/components/ui/SliderQuota";
import Search from "@/components/pages/home/Search/index";
import AvatarAux from "@/components/ui/Avatar";
import { getUsersConversations } from "@/services/talk/room";
import DirectoryList from "@/components/ui/skeleton/DirectoryList";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["home", "invitation", "library"])),
  },
});

function Home() {
  const { t } = useTranslation("home");
  const { t: invitation } = useTranslation("invitation");

  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const library = useSelector((state: { library: PropsLibrarySelector }) => state.library);

  const { data } = getUsersConversations({
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return (
    <LayoutApp title={t("welcomeTitle")}>
      <div
        style={{
          backgroundColor: "#4C517F",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          color: "#b7b8c8",
          height: "50px",
        }}
      >
        <strong>
          {invitation("greeting")} {userRdx.user.name}
        </strong>
      </div>

      <div
        style={{
          backgroundColor: "#4C517F",
          height: "60px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
        }}
      >
        <AvatarAux size={10} image="/images/honeycombs/example1.png" />
      </div>
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART}>
        <FilesInfoSection />
        <Search />
        <RecentFiles library={library} />

        {!data ? <DirectoryList /> : <HoneyCombsList data={data.ocs.data} />}

        <div
          style={{
            marginLeft: 15,
            paddingRight: 25,
            marginTop: 20,
            width: "100%",
            marginBottom: "20px",
          }}
        >
          <SliderQuota />
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default Home;
