import React from "react";
import Container from "@/components/ui/Container";
import FooterApp from "@/components/layout/FooterApp";
import HeaderApp from "@/components/layout/HeaderApp";
import FlexBox from "@/components/ui/FlexBox";
import Box from "@material-ui/core/Box";
import Divider from "@/components/ui/Divider";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { I18nInterface, UserInvitationInterface } from "@/interfaces/index";
import { TextVariantEnum } from "@/enums/index";
import Text from "@/components/ui/Text";
import Form from "@/components/pages/complete-register/Form";
import { parseJwt } from "@/utils/utils";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["completeRegister"])),
  },
});

export default function CompleteRegister() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const data = parseJwt<UserInvitationInterface | undefined>(userRdx?.invitationToken);
  const { t } = useTranslation("completeRegister");
  const { t: c } = useTranslation("common");

  return (
    <Container>
      <FlexBox>
        <HeaderApp />
        <Box className="width-based-device" flexDirection="column" display="flex">
          <Text variant={TextVariantEnum.BODY1} style={{ marginBottom: 15 }}>
            {c("invitationGreeting", { name: data?.name })}
          </Text>
          <Text variant={TextVariantEnum.BODY2}>{t("description")}</Text>
          <Divider />
          <Form invitationToken={userRdx?.invitationToken} />
        </Box>
        <FooterApp about={false} terms={false} />
      </FlexBox>
    </Container>
  );
}
