import { useEffect } from "react";
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
import { GetStaticProps, GetStaticPaths } from "next";
import { I18nInterface } from "@/interfaces/index";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/index";
import { isJWTValidInvitation } from "@/utils/utils";
import { useDispatch } from "react-redux";
import { setInvitationToken } from "@/store/actions/users/index";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["invitation", "common"])),
  },
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

function Invitation() {
  const { t } = useTranslation("invitation");
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    const { token: invitationToken, valid } = isJWTValidInvitation(token);
    if (!valid) router.push("/");
    else dispatch(setInvitationToken({ invitationToken }));
  }, [dispatch, router, token]);

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
            display="flex"
            flexDirection="column"
            style={{
              width: "100%",
            }}
          >
            <Button title={t("forms.button1")} url="/complete-register" />
          </Box>
        </div>
      </Box>
      <FooterApp about={false} terms fixed />
    </Container>
  );
}

export default Invitation;
