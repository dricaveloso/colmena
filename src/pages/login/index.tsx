import React from "react";
import Container from "@/components/ui/Container";
import FooterApp from "@/components/layout/FooterApp";
import HeaderApp from "@/components/layout/HeaderApp";
import FlexBox from "@/components/ui/FlexBox";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Divider from "@/components/ui/Divider";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { TextVariantEnum } from "@/enums/index";
import Text from "@/components/ui/Text";
import Form from "@/components/pages/login/Form";
import { useSelector, useDispatch } from "react-redux";
import { userUpdate } from "@/store/actions/users/index";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["login", "common"])),
  },
});

export default function Login() {
  const { user, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation("login");

  const userUpdateHandle = () => {
    dispatch(userUpdate({ user: { name: "Vinicius Gusmão", email: "vinicius-og@hotmail.com" } }));
  };

  console.log(user, token);

  return (
    <Container>
      <FlexBox>
        <HeaderApp />
        <Box className="width-based-device" flexDirection="column" display="flex">
          <Text variant={TextVariantEnum.BODY2}>{t("title")}</Text>
          <Divider />
          <Button onClick={userUpdateHandle}>Teste</Button>
          <Form />
        </Box>
        <FooterApp about={false} terms={false} />
      </FlexBox>
    </Container>
  );
}
