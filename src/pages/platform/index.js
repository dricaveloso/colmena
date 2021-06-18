import Container from "component/ui/Container";
import FooterApp from "component/layout/FooterApp";
import HeaderApp from "component/layout/HeaderApp";
import FlexBox from "component/ui/FlexBox";
import IconButton from "component/ui/IconButton";
import Divider from "component/ui/Divider";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

export default function Platform() {
  const { t } = useTranslation("common");
  const router = useRouter();

  return (
    <Container>
      <FlexBox>
        <HeaderApp />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 18 }}>{t("textUseApp")}</p>
          <Divider marginTop={30} />
          <IconButton
            title="Desktop"
            variantTitle="p"
            icon="desktop_windows"
            fontSizeIcon="2.6em"
            color="black"
            handleClick={() => router.push("/home")}
          />
          <Divider marginTop={30} />
          <IconButton
            title="Mobile"
            variantTitle="p"
            icon="phone_android"
            fontSizeIcon="2.6em"
            color="black"
            handleClick={() => router.push("/home")}
          />
        </div>
        <FooterApp about={false} terms={true} />
      </FlexBox>
    </Container>
  );
}
