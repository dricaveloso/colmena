import React, { useContext, useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import FooterApp from "@/components/layout/FooterApp";
import HeaderApp from "@/components/layout/HeaderApp";
import FlexBox from "@/components/ui/FlexBox";
import Box from "@material-ui/core/Box";
import Divider from "@/components/ui/Divider";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface, UserInvitationInterface } from "@/interfaces/index";
import { TextVariantEnum } from "@/enums/index";
import Text from "@/components/ui/Text";
import Form from "@/components/pages/complete-register/Form";
import UserContext from "@/store/context/user-context";
import { parseJwt } from "@/utils/utils";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["completeRegister", "common"])),
  },
});

export default function CompleteRegister() {
  const userCtx = useContext(UserContext);
  const [data, setData] = useState<UserInvitationInterface | undefined>(undefined);
  const { t } = useTranslation("completeRegister");
  const { t: c } = useTranslation("common");

  useEffect(() => {
    const invitationObject = parseJwt<UserInvitationInterface | undefined>(userCtx.invitationToken);
    setData(invitationObject);
  }, [userCtx]);

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
          <Form userInfo={data} />
        </Box>
        <FooterApp about={false} terms={false} />
      </FlexBox>
    </Container>
  );
}
