import Container from "component/ui/Container";
import FooterApp from "component/layout/FooterApp";
import HeaderApp from "component/layout/HeaderApp";
import Button from "component/ui/Button";
import FlexBox from "component/ui/FlexBox";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PasswordField from "component/statefull/PasswordField";
import Divider from "component/ui/Divider";
import Box100 from "component/ui/Box100";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["completeRegister", "common"])),
    },
  };
};

export default function CompleteRegister(props) {
  const { t } = useTranslation("completeRegister");
  const router = useRouter();

  return (
    <Container>
      <FlexBox>
        <HeaderApp />
        <Box my={4} style={{ textAlign: "center", padding: 10 }}>
          <Typography component="p" gutterBottom>
            {t("description")}
          </Typography>
          <Divider />
          <Box>
            <Box100>
              <PasswordField
                title={t("forms.placeholderPassword")}
                id="password"
              />
              <Divider />
              <PasswordField
                id="passwordConfirmation"
                title={t("forms.placeholderPasswordConfirmation")}
              />
              <Divider />
            </Box100>
          </Box>
          <Box style={{ display: "flex", flexDirection: "column" }}>
            <Button
              title={t("forms.submitButton")}
              handleClick={() => router.push("/platform")}
            />
          </Box>
        </Box>
        <FooterApp about={false} terms={true} />
      </FlexBox>
    </Container>
  );
}
