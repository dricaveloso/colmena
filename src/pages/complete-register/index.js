import Container from "component/ui/Container";
import FooterApp from "component/layout/FooterApp";
import HeaderApp from "component/layout/HeaderApp";
import Button from "component/ui/Button";
import FlexBox from "component/ui/FlexBox";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PasswordField from "component/ui/PasswordField";
import Divider from "component/ui/Divider";
import useTranslation from "hooks/useTranslation";

export default function CompleteRegister(props) {
  const { t } = useTranslation(props.lang, "completeRegister");
  return (
    <Container>
      <FlexBox>
        <HeaderApp />
        <Box my={4} style={{ textAlign: "center", padding: 10 }}>
          <Typography component="p" gutterBottom>
            {t?.description}
          </Typography>
          <Divider />
          <Box>
            <PasswordField title={t?.forms.placeholderPassword} id="password" />
            <Divider />
            <PasswordField
              id="passwordConfirmation"
              title={t?.forms.placeholderPasswordConfirmation}
            />
            <Divider />
          </Box>
          <Box style={{ display: "flex", flexDirection: "column" }}>
            <Button title={t?.forms.submitButton} handleClick={() => {}} />
          </Box>
        </Box>
        <FooterApp about={true} terms={true} lang={props.lang} />
      </FlexBox>
    </Container>
  );
}
