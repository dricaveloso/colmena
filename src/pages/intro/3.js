import Container from "component/ui/Container";
import FooterApp from "component/layout/FooterApp";
import HeaderApp from "component/layout/HeaderApp";
import Button from "component/ui/Button";
import FlexBox from "component/ui/FlexBox";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CloudUploadSharpIcon from "@material-ui/icons/CloudUploadSharp";
import Divider from "component/ui/Divider";
import SkipButton from "component/pages/intro/SkipButton";
import { useRouter } from "next/router";
import useTranslation from "hooks/useTranslation";
import Box100 from "component/ui/Box100";

export default function Intro3(props) {
  const router = useRouter();
  const { t } = useTranslation(props.lang, "intro");

  return (
    <Container>
      <FlexBox>
        <HeaderApp />
        <Box my={4} style={{ textAlign: "center", padding: 10 }}>
          <CloudUploadSharpIcon style={{ fontSize: "150px" }} />
          <Divider marginTop={10} />
          <Box100>
            <Typography
              component="p"
              variantMapping="p"
              gutterBottom
              className="width-based-device"
            >
              {t?.step3.description}
            </Typography>
          </Box100>
          <Divider />
          <Box style={{ display: "flex", flexDirection: "column" }}>
            <Button
              title={t?.forms.nextButton}
              handleClick={() => router.push("/intro/4")}
            />
            <Divider marginTop={15} />
            <SkipButton title={t?.forms.skipButton} />
          </Box>
        </Box>
        <FooterApp about={false} terms={true} lang={props.lang} />
      </FlexBox>
    </Container>
  );
}
