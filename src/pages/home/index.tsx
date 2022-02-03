import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum, TextVariantEnum } from "@/enums/index";
import { useTranslation } from "next-i18next";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
// import ResourceUnavailable from "@/components/ui/ResourceUnavailable";
import RecentFiles from "@/components/pages/home/RecentFiles";
import { PropsLibrarySelector, PropsUserSelector } from "@/types/*";
import { useSelector } from "react-redux";
import FilesInfoSection from "@/components/pages/home/FilesInfo";
import HoneyCombsList from "@/components/pages/home/Section3";
import SliderQuota from "@/components/ui/SliderQuota";
// import Search from "@/components/pages/home/Search/index";
import Avatar from "@/components/pages/profile/AvatarWithContextMenu";
import { getUsersConversations } from "@/services/talk/room";
import DirectoryList from "@/components/ui/skeleton/DirectoryList";
import theme from "@/styles/theme";
import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import { getFirstname } from "@/utils/utils";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["home", "invitation", "library"])),
  },
});

function Home() {
  const { t } = useTranslation("home");

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
          backgroundColor: theme.palette.primary.main,
          width: "100%",
        }}
      >
        <Box
          height={28}
          style={{
            backgroundColor: theme.palette.primary.main,
          }}
          width="100%"
        >
          <Text
            style={{
              color: theme.palette.primary.light,
              fontSize: 14,
              margin: 0,
              padding: 0,
              textAlign: "center",
            }}
            variant={TextVariantEnum.CAPTION}
          >
            {t("greetingTitle")} {getFirstname(userRdx.user.name)}
          </Text>
        </Box>
        <div
          style={{
            backgroundColor: theme.palette.primary.main,
            height: "60px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
          }}
        >
          <Avatar size={10} showEditImage />
        </div>
      </div>

      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART}>
        <FilesInfoSection />
        {/* <Search /> */}
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
