import Container from "component/ui/Container";
import FooterApp from "component/layout/FooterApp";
import HeaderApp from "component/layout/HeaderApp";
import Button from "component/ui/Button";
import Box100 from "component/ui/Box100";
import FlexBox from "component/ui/FlexBox";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PermDataSettingSharpIcon from "@material-ui/icons/PermDataSettingSharp";
import Divider from "component/ui/Divider";
import { useRouter } from "next/router";
import SkipButton from "component/pages/intro/SkipButton";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["intro", "common"])),
    },
  };
};

export default function Intro1() {
  const router = useRouter();
  const { t } = useTranslation("intro");
  return (
    <Container>
      <FlexBox>
        <HeaderApp />
        <Box my={4} style={{ textAlign: "center", padding: 10 }}>
          <PermDataSettingSharpIcon style={{ fontSize: "150px" }} />
          <Divider marginTop={10} />
          <Box100>
            <Typography
              component="p"
              variantMapping="p"
              align="center"
              display="block"
              gutterBottom
              className="width-based-device"
            >
              {t("step1.description")}
            </Typography>
          </Box100>
          <Divider />
          <Box style={{ display: "flex", flexDirection: "column" }}>
            <Button
              title={t("forms.nextButton")}
              handleClick={() => router.push("/intro/2")}
            />
            <Divider marginTop={15} />
            <SkipButton title={t("forms.skipButton")} />
          </Box>
        </Box>
        <FooterApp about={false} terms={true} />
      </FlexBox>
    </Container>
  );
}
