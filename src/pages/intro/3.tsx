import Container from "component/ui/Container";
import FooterApp from "component/layout/FooterApp";
import HeaderApp from "component/layout/HeaderApp";
import Button from "component/ui/Button";
import FlexBox from "component/ui/FlexBox";
import Box from "@material-ui/core/Box";
import CloudUploadSharpIcon from "@material-ui/icons/CloudUploadSharp";
import Divider from "component/ui/Divider";
import SkipButton from "component/pages/intro/SkipButton";
import { useRouter } from "next/router";
import Box100 from "component/ui/Box100";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "interfaces";
import Text from "component/ui/Text";
import { TextVariantEnum } from "enums";

export const getStaticProps: GetStaticProps = async ({
  locale,
}: I18nInterface) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["intro", "common"])),
    },
  };
};

export default function Intro3() {
  const router = useRouter();
  const { t } = useTranslation("intro");

  return (
    <Container>
      <FlexBox>
        <HeaderApp />
        <Box my={4} style={{ textAlign: "center", padding: 10 }}>
          <CloudUploadSharpIcon style={{ fontSize: "150px" }} />
          <Divider marginTop={10} />
          <Box100>
            <Text
              variant={TextVariantEnum.BODY1}
              gutterBottom
              className="width-based-device"
            >
              {t("step3.description")}
            </Text>
          </Box100>
          <Divider />
          <Box style={{ display: "flex", flexDirection: "column" }}>
            <Button
              title={t("forms.nextButton")}
              handleClick={() => router.push("/intro/4")}
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
