import React, { useState, useContext } from "react";
import Container from "@/components/ui/Container";
import FooterApp from "@/components/layout/FooterApp";
import HeaderApp from "@/components/layout/HeaderApp";
import Button from "@/components/ui/Button";
import FlexBox from "@/components/ui/FlexBox";
import { Box, Checkbox } from "@material-ui/core";
import PasswordField from "@/components/statefull/PasswordField";
import Divider from "@/components/ui/Divider";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TermsOfUse from "@/components/statefull/TermsOfUse";
import Box100 from "@/components/ui/Box100";
import NotificationContext from "@/store/notification-context";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { NotificationStatusEnum, TextVariantEnum } from "@/enums/index";
import Text from "@/components/ui/Text";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["completeRegister", "common"])),
  },
});

export default function CompleteRegister() {
  const [openTerms, setOpenTerms] = useState(false);
  const [accept, setAccept] = useState(false);
  const { t } = useTranslation("completeRegister");
  const { t: c } = useTranslation("common");
  const notificationCtx = useContext(NotificationContext);
  const router = useRouter();

  const handleChange = (event: any) => {
    setAccept(event.target.checked);
  };

  const handleSubmit = () => {
    notificationCtx.showNotification({
      message: t("messagePasswordCreated"),
      status: NotificationStatusEnum.SUCCESS,
    });
    router.push("/home");
  };

  return (
    <Container>
      <FlexBox>
        <HeaderApp />
        <Box>
          <Box100>
            <Text variant={TextVariantEnum.BODY1}>{t("description")}</Text>
            <Divider />
            <div>
              <PasswordField title={t("forms.placeholderPassword")} id="password" />
              <Divider />
              <PasswordField
                id="passwordConfirmation"
                title={t("forms.placeholderPasswordConfirmation")}
              />
              <Divider />
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  onChange={handleChange}
                  inputProps={{ "aria-label": "uncontrolled-checkbox" }}
                />
                <p>
                  {c("agreeWithTerms")} {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    style={{ color: "tomato", cursor: "pointer" }}
                    onClick={() => setOpenTerms(true)}
                  >
                    {c("termsOfUse")}
                  </a>
                </p>
              </div>
              <Button
                title={t("forms.submitButton")}
                disabled={!accept}
                handleClick={handleSubmit}
              />
            </div>
            <TermsOfUse open={openTerms} handleSetOpen={(flag) => setOpenTerms(flag)} />
          </Box100>
        </Box>
        <FooterApp about={false} terms={false} />
      </FlexBox>
    </Container>
  );
}
