import Container from "component/ui/Container";
import FooterApp from "component/layout/FooterApp";
import Divider from "component/ui/Divider";
import Button from "component/ui/Button";
import Box from "@material-ui/core/Box";
import MailOutlineSharpIcon from "@material-ui/icons/MailOutlineSharp";
import { useRouter } from "next/router";
import Box100 from "component/ui/Box100";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "interfaces";
import Text from "component/ui/Text";
import { TextVariantEnum } from "enums";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["invitation", "common"])),
    },
  };
};

function Invitation() {
  const router = useRouter();
  const { t } = useTranslation("invitation");

  const navigate = () => {
    router.push("/intro/1");
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
      <FooterApp about={false} terms={true} fixed={true} />
    </Container>
  );
}

export default Invitation;
