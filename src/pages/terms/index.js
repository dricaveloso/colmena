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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in
              odio molestie justo eleifend dignissim sed sit amet augue. Donec
              tristique vitae arcu in tincidunt. Phasellus gravida commodo
              libero et cursus. Aliquam erat volutpat. Vestibulum ante ipsum
              primis in faucibus orci luctus et ultrices posuere cubilia curae;
              Integer posuere malesuada nunc. Fusce fringilla consectetur sem,
              eu gravida purus volutpat et. In laoreet metus commodo purus
              commodo, ac euismod turpis posuere. Aenean mattis suscipit leo,
              eget suscipit purus volutpat ac. Donec porta, nibh sit amet
              viverra facilisis, libero elit rutrum diam, vel pellentesque enim
              ex at ligula. Aliquam feugiat nunc ac felis porta, ut tempus purus
              hendrerit. Nulla ornare ipsum at purus ullamcorper, ut fermentum
              massa porttitor. Nullam rhoncus vestibulum ante, eget pellentesque
              nibh aliquet in. Aliquam condimentum elementum mauris, at rhoncus
              nisi porttitor sed. Etiam vitae ante erat.
            </p>
          </Box>
        </div>
      </FlexBox>
    </Container>
  );
}
