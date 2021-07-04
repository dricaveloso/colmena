import Container from "component/ui/Container";
import FooterApp from "component/layout/FooterApp";
import HeaderApp from "component/layout/HeaderApp";
import FlexBox from "component/ui/FlexBox";
import IconButton from "component/ui/IconButton";
import Divider from "component/ui/Divider";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "interfaces";
import { TextVariantEnum } from "enums";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default function Platform() {
  const { t } = useTranslation("common");
  const router = useRouter();

  const navigate = () => {
    router.push("/home");
  };

  return (
    <Container>
      <FlexBox>
        <HeaderApp />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 18 }}>{t("textUseApp")}</p>
          <Divider marginTop={30} />
          <IconButton
            title="Desktop"
            variantTitle={TextVariantEnum.BODY1}
            icon="desktop_windows"
            fontSizeIcon="2.6em"
            color="black"
            handleClick={navigate}
          />
          <Divider marginTop={30} />
          <IconButton
            title="Mobile"
            variantTitle={TextVariantEnum.BODY1}
            icon="phone_android"
            fontSizeIcon="2.6em"
            color="black"
            handleClick={navigate}
          />
        </div>
        <FooterApp about={false} terms />
      </FlexBox>
    </Container>
  );
}
