import Container from "component/ui/Container";
import FooterApp from "component/layout/FooterApp";
import HeaderApp from "component/layout/HeaderApp";
import Button from "component/ui/Button";
import FlexBox from "component/ui/FlexBox";
import Box from "@material-ui/core/Box";
import WifiOffSharpIcon from "@material-ui/icons/WifiOffSharp";
import Divider from "component/ui/Divider";
import { useRouter } from "next/router";
import SkipButton from "component/pages/intro/SkipButton";
import Box100 from "component/ui/Box100";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { I18nInterface } from "interfaces";
import Text from "component/ui/Text";
import { TextVariantEnum, TextDisplayEnum } from "enums";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["intro", "common"])),
  },
});

export default function Intro2() {
  const router = useRouter();
  const { t } = useTranslation("intro");

  const navigate = () => {
    router.push("/intro/3");
  };

  return (
    <Container>
      <FlexBox>
        <HeaderApp />
        <Box my={4} style={{ textAlign: "center", padding: 10 }}>
          <WifiOffSharpIcon style={{ fontSize: "150px" }} />
          <Divider marginTop={10} />
          <Box100>
            <Text
              variant={TextVariantEnum.BODY1}
              gutterBottom
              display={TextDisplayEnum.BLOCK}
              className="width-based-device"
            >
              {t("step2.description")}
            </Text>
          </Box100>
          <Divider />
          <Box style={{ display: "flex", flexDirection: "column" }}>
            <Button title={t("forms.nextButton")} handleClick={navigate} />
            <Divider marginTop={15} />
            <SkipButton title={t("forms.skipButton")} />
          </Box>
        </Box>
        <FooterApp about={false} terms />
      </FlexBox>
    </Container>
  );
}
