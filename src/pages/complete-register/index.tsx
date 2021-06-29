import { useState, useContext } from "react";
import Container from "component/ui/Container";
import FooterApp from "component/layout/FooterApp";
import HeaderApp from "component/layout/HeaderApp";
import Button from "component/ui/Button";
import FlexBox from "component/ui/FlexBox";
import { Typography, Box, Checkbox } from "@material-ui/core";
import PasswordField from "component/statefull/PasswordField";
import Divider from "component/ui/Divider";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TermsOfUse from "component/statefull/TermsOfUse";
import Box100 from "component/ui/Box100";
import NotificationContext from "store/notification-context";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["completeRegister", "common"])),
    },
  };
};

export default function CompleteRegister(props) {
  const [openTerms, setOpenTerms] = useState(false);
  const [accept, setAccept] = useState(false);
  const { t } = useTranslation("completeRegister");
  const { t: c } = useTranslation("common");
  const notificationCtx = useContext(NotificationContext);
  const router = useRouter();

  const handleChange = (event) => {
    setAccept(event.target.checked);
  };

  const handleSubmit = () => {
    notificationCtx.showNotification({
      message: "Senha criada com sucesso.",
      status: "success",
    });
    router.push("/platform");
  };

  return (
    <Container>
      <FlexBox>
        <HeaderApp />
        <Box>
          <Box100>
            <Typography component="p" gutterBottom>
              {t("description")}
            </Typography>
            <Divider />
            <div>
              <PasswordField
                title={t("forms.placeholderPassword")}
                id="password"
              />
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
                  {c("agreeWithTerms")}{" "}
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
            <TermsOfUse
              open={openTerms}
              handleSetOpen={(flag) => setOpenTerms(flag)}
            />
          </Box100>
        </Box>
        <FooterApp about={false} terms={false} />
      </FlexBox>
    </Container>
  );
}
