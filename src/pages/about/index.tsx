import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum, TextVariantEnum } from "@/enums/index";
import MaterialIcon from "@/components/ui/MaterialIcon";
import WhiteSpaceFooter from "@/components/ui/WhiteSpaceFooter";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import Text from "@/components/ui/Text";
import Box from "@material-ui/core/Box";
import theme from "@/styles/theme";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["intro"])),
  },
});

function About() {
  const { t } = useTranslation("intro");
  const fontSize = "4.0em";
  const color = theme.palette.icon.dark;
  const classeItems = "flex my-2 justify-between flex-row items-center p-4";

  return (
    <LayoutApp title={t("aboutTitle")} back>
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART} padding={0}>
        <Box className={classeItems} style={{ backgroundColor: "#fff" }}>
          <MaterialIcon
            icon="perm_data_setting_sharp"
            style={{ fontSize, color, marginRight: 15 }}
          />
          <Text variant={TextVariantEnum.BODY2} style={{ textAlign: "start", margin: 5 }}>
            {t("step1.description")}
          </Text>
        </Box>
        <Box className={classeItems}>
          <Text variant={TextVariantEnum.BODY2} style={{ textAlign: "start", margin: 12 }}>
            {t("step2.description")}
          </Text>
          <MaterialIcon icon="wifi_off_sharp" style={{ fontSize, color, marginLeft: 15 }} />
        </Box>
        <Box style={{ backgroundColor: "#fff" }} className={classeItems}>
          <MaterialIcon icon="cloud_upload_sharp" style={{ fontSize, color, marginRight: 15 }} />
          <Text variant={TextVariantEnum.BODY2} style={{ textAlign: "start", margin: 5 }}>
            {t("step3.description")}
          </Text>
        </Box>
        <Box className={classeItems}>
          <Text variant={TextVariantEnum.BODY2} style={{ textAlign: "start", margin: 12 }}>
            {t("step4.description")}
          </Text>
          <MaterialIcon
            icon="supervised_user_circle_sharp"
            style={{ fontSize, color, marginLeft: 15 }}
          />
        </Box>
      </FlexBox>
      <WhiteSpaceFooter />
    </LayoutApp>
  );
}

export default About;
