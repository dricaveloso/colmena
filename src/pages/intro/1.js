import Container from "component/ui/Container";
import FooterApp from "component/layout/FooterApp";
import HeaderApp from "component/layout/HeaderApp";
import Button from "component/ui/Button";
import FlexBox from "component/ui/FlexBox";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PermDataSettingSharpIcon from "@material-ui/icons/PermDataSettingSharp";
import Divider from "component/ui/Divider";
import { useRouter } from "next/router";
import useTranslation from "hooks/useTranslation";
import SkipButton from "component/pages/intro/SkipButton";

export default function Intro1(props) {
  const router = useRouter();
  const { t } = useTranslation(props.lang, "intro");
  return (
    <Container>
      <FlexBox>
        <HeaderApp />
        <Box my={4} style={{ textAlign: "center", padding: 10 }}>
          <PermDataSettingSharpIcon style={{ fontSize: "150px" }} />
          <Divider marginTop={10} />
          <Typography component="p" gutterBottom>
            {t?.step1?.description}
          </Typography>
          <Divider />
          <Box style={{ display: "flex", flexDirection: "column" }}>
            <Button
              title={t?.forms?.nextButton}
              handleClick={() => router.push("/intro/2")}
            />
            <Divider marginTop={15} />
            <SkipButton title={t?.forms?.skipButton} />
          </Box>
        </Box>
        <FooterApp about={false} terms={true} lang={props.lang} />
      </FlexBox>
    </Container>
  );
}
