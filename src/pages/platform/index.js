import Container from "component/ui/Container";
import FooterApp from "component/layout/FooterApp";
import HeaderApp from "component/layout/HeaderApp";
import FlexBox from "component/ui/FlexBox";
import useTranslation from "hooks/useTranslation";
import IconButton from "component/ui/IconButton";
import Divider from "component/ui/Divider";
import { useRouter } from "next/router";

export default function Platform(props) {
  const { t } = useTranslation(props.lang, "common");
  const router = useRouter();
  return (
    <Container>
      <FlexBox>
        <HeaderApp />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 18 }}>{t?.textUseApp}</p>
          <Divider marginTop={30} />
          <IconButton
            title="Desktop"
            variantTitle="p"
            icon="DesktopWindowsIcon"
            fontSizeIcon="2.6em"
            color="black"
            handleClick={() => router.push("/home")}
          />
          <Divider marginTop={30} />
          <IconButton
            title="Mobile"
            variantTitle="p"
            icon="PhoneAndroidIcon"
            fontSizeIcon="2.6em"
            color="black"
            handleClick={() => router.push("/home")}
          />
        </div>
        <FooterApp about={false} terms={true} lang={props.lang} />
      </FlexBox>
    </Container>
  );
}
