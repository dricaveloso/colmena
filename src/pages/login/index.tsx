/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import Box from "@material-ui/core/Box";
import Divider from "@/components/ui/Divider";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import Form from "@/components/pages/login/Form";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import CenterProgress from "@/components/ui/CenterProgress";
import ExternalVerticalLogo from "@/components/ui/ExternalVerticalLogo";
import FooterDW from "@/components/ui/FooterDW";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import theme from "@/styles/theme";
import Text from "@/components/ui/Text";
import { useTranslation } from "next-i18next";
import { TextVariantEnum } from "@/enums/*";
import { useDispatch } from "react-redux";
import { parseCookies } from "nookies";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["login"])),
  },
});

export default function Login() {
  const cookies = parseCookies();
  const dispatch = useDispatch();
  const { t } = useTranslation("login");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLower640, setIsLower640] = useState(false);
  const locale = cookies.NEXT_LOCALE || "en";

  useEffect(() => {
    if (window.innerHeight <= 640) setIsLower640(true);

    if (router.asPath.indexOf("?out") !== -1) {
      dispatch({ type: "USER_LOGGED_OUT" });
      router.push("/login", "", {
        locale,
      });
    }

    if (!navigator.onLine) {
      router.replace("/home", "", {
        locale,
      });
      return;
    }
    getSession().then((session) => {
      if (session) {
        router.replace("/home", "", {
          locale,
        });
      } else {
        setIsLoading(false);
      }
    });
  }, []);
  if (isLoading) return <CenterProgress />;

  const backgroundColor = theme.palette.primary.main;

  return (
    <Container
      backgroundColor={backgroundColor}
      extraStyle={{
        backgroundImage: "url('/images/svg/bg.svg')",
        backgroundPosition: "bottom",
        backgroundRepeat: "repeat-x",
      }}
    >
      <Box
        className="width-based-device"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        display="flex"
      >
        <ExternalVerticalLogo />
        <Divider marginTop={24} />
        <Text variant={TextVariantEnum.BODY1} style={{ color: "#fff", textAlign: "center" }}>
          {t("title")}
        </Text>
        <Divider marginTop={24} />
        <Form />
      </Box>
      {!isLower640 && <FooterDW />}
    </Container>
  );
}
