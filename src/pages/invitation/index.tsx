import Container from "@/components/ui/Container";
import FooterApp from "@/components/layout/FooterApp";
import Divider from "@/components/ui/Divider";
import Button from "@/components/ui/Button";
import Box from "@material-ui/core/Box";
import MailOutlineSharpIcon from "@material-ui/icons/MailOutlineSharp";
import { useRouter } from "next/router";
import Box100 from "@/components/ui/Box100";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/index";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["invitation", "common"])),
  },
});

function Invitation() {
  const router = useRouter();
  const { t } = useTranslation("invitation");

  const navigate = () => {
    router.push("/complete-register");
  };

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
          <Text variant={TextVariantEnum.H5} gutterBottom>
            {t("greeting")}
          </Text>
          <Divider marginTop={10} />
          <Box100>
            <Text variant={TextVariantEnum.BODY1} gutterBottom className="width-based-device">
              {t("description")}
            </Text>
          </Box100>
          <Divider />
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Button title={t("forms.button1")} handleClick={navigate} />
          </Box>
        </div>
      </Box>
      <FooterApp about={false} terms fixed />
    </Container>
  );
}

export default Invitation;
