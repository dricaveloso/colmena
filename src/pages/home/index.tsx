import FlexBox from "@/components/ui/FlexBox";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import LayoutApp from "@/components/statefull/LayoutApp";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum, TextVariantEnum } from "@/enums/index";
import { useTranslation } from "next-i18next";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
// import ResourceUnavailable from "@/components/ui/ResourceUnavailable";
import RecentFiles from "@/components/pages/home/RecentFiles";
import { PropsUserSelector } from "@/types/*";
import { useSelector } from "react-redux";
import FilesInfoSection from "@/components/pages/home/FilesInfo";
import HoneyCombsList from "@/components/pages/home/Section3";
import SliderQuota from "@/components/ui/SliderQuota";
// import Search from "@/components/pages/home/Search/index";
import Avatar from "@/components/pages/profile/AvatarWithContextMenu";
import theme from "@/styles/theme";
import Box from "@material-ui/core/Box";
import Text from "@/components/ui/Text";
import { getFirstname } from "@/utils/utils";
import Carousel from "@/components/pages/home/Carousel";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["home", "invitation", "library", "common", "intro"])),
  },
});

const useStyles = makeStyles((theme) =>
  createStyles({
    header: {
      backgroundColor: theme.palette.primary.main,
      width: "100%",
    },
    userName: {
      color: theme.palette.primary.contrastText,
      fontSize: 16,
      margin: 0,
      padding: 0,
      textAlign: "center",
      fontWeight: "bold",
    },
    mediaName: {
      color: theme.palette.primary.light,
      fontSize: 13,
    },
    avatar: {
      backgroundColor: theme.palette.primary.main,
      height: "60px",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      paddingTop: "20px",
    },
    sliderQuota: {
      marginLeft: 15,
      paddingRight: 25,
      marginTop: 20,
      width: "100%",
      marginBottom: "20px",
    },
  }),
);

function Home() {
  const classes = useStyles();
  const { t } = useTranslation("home");

  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  return (
    <LayoutApp title={t("welcomeTitle")}>
      <Box className={classes.header}>
        <Box
          height={28}
          style={{
            backgroundColor: theme.palette.primary.main,
          }}
          width="100%"
        >
          <Text className={classes.userName} variant={TextVariantEnum.CAPTION}>
            {t("greetingTitle")} {getFirstname(userRdx.user.name)}
          </Text>
          <Text className={classes.mediaName}>{userRdx.user?.media?.name}</Text>
        </Box>
        <Box className={classes.avatar}>
          <Avatar size={10} showEditImage />
        </Box>
      </Box>

      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART}>
        <FilesInfoSection />
        {/* <Search /> */}
        <Carousel />
        <RecentFiles />
        <HoneyCombsList />
        <Box className={classes.sliderQuota}>
          <SliderQuota />
        </Box>
      </FlexBox>
    </LayoutApp>
  );
}

export default Home;
