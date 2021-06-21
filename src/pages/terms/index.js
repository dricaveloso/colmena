import Container from "component/ui/Container";
import HeaderApp from "component/layout/HeaderApp";
import FlexBox from "component/ui/FlexBox";
import Box from "@material-ui/core/Box";
import { useRouter } from "next/router";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

export default function Terms(props) {
  const router = useRouter();
  const { t } = useTranslation("common");

  return (
    <Container>
      <FlexBox>
        <HeaderApp />
        <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
          <ArrowBackIcon onClick={() => router.back()} />
          <Box
            style={{
              padding: 5,
              display: "flex",
              flex: 1,
              justifyContent: "flex-start",
              flexDirection: "column",
            }}
          >
            <p style={{ fontWeight: "bold", textAlign: "center" }}>
              {t("termsOfUse")}
            </p>
            <p style={{ textAlign: "justify" }}>
              
              All human beings are born free and equal in dignity and rights. 
              
              Everyone has the right to life, liberty and security of person.
              
              No one shall be subjected to torture or to cruel, inhuman or degrading treatment or punishment.

              Everyone has the right to recognition everywhere as a person before the law.
              
            </p>
          </Box>
        </div>
      </FlexBox>
    </Container>
  );
}
