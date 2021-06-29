import Container from "component/ui/Container";
import FooterApp from "component/layout/FooterApp";
import Divider from "component/ui/Divider";
import Button from "component/ui/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import MailOutlineSharpIcon from "@material-ui/icons/MailOutlineSharp";
import { useRouter } from "next/router";
import Box100 from "component/ui/Box100";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["invitation", "common"])),
    },
  };
};

function Invitation() {
  const router = useRouter();
  const { t } = useTranslation("invitation");

  return (
    <Container>
      <Box
        my={4}
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 10,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <MailOutlineSharpIcon style={{ fontSize: "150px" }} />
          <Divider marginTop={10} />
          <Typography variant="h5" component="h4" gutterBottom>
            {t("greeting")}
          </Typography>
          <Divider marginTop={10} />
          <Box100>
            <Typography
              component="p"
              gutterBottom
              className="width-based-device"
            >
              {t("description")}
            </Typography>
          </Box100>
          <Divider />
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Button
              title={t("forms.button1")}
              handleClick={() => router.push("/intro/1")}
            />
          </Box>
        </div>
      </Box>
      <FooterApp about={false} terms={true} fixed={true} />
    </Container>
  );
}

export default Invitation;
