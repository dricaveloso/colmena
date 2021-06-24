import React, { useContext } from "react";
import FlexBox from "component/ui/FlexBox";
import LayoutApp from "component/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TextField from "component/ui/TextField";
import { makeStyles } from "@material-ui/styles";
import MaterialIcon from "component/ui/MaterialIcon";
import Text from "component/ui/Text";
import Button from "component/ui/Button";
import IconButton from "component/ui/IconButton";
import { useRouter } from "next/router";
import NotificationContext from "store/notification-context";
import SocialMediaIconButton from "component/statefull/SocialMediaIconButtons";

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "profile",
        "drawer",
        "common",
      ])),
    },
  };
};

const useStyles = makeStyles((theme) => ({
  marginInputDivs: {
    "& > div": {
      marginBottom: 15,
    },
  },
}));

function Profile() {
  const { t } = useTranslation("profile");
  const { t: c } = useTranslation("common");
  const notificationCtx = useContext(NotificationContext);
  const classes = useStyles();
  const router = useRouter();

  return (
    <LayoutApp title={t("title")} back={true}>
      <FlexBox justifyContent="flex-start">
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            marginTop: 70,
            marginRight: 10,
          }}
        >
          <IconButton
            fontSizeIcon="1.8em"
            title={t("mediaTitle")}
            color="black"
            icon="settings"
            handleClick={() => router.push("/media-profile")}
          />
        </div>
        <div className={classes.marginInputDivs}>
          <div className="boxColumnCenter">
            <MaterialIcon icon="add_a_photo" style={{ fontSize: 120 }} />
            <Text>Makena</Text>
          </div>
          <TextField id="name" label={t("nameField")} variant="outlined" />
          <TextField id="email" label={t("emailField")} variant="outlined" />
          <TextField
            id="url_blog"
            className="width-based-device"
            label={t("urlField")}
            variant="outlined"
          />

          <Text>{t("socialMediaTitle")}</Text>
          <div className="boxRowCenter marginTop15">
            <SocialMediaIconButton />
          </div>
          <div className="marginTop15">
            <Button
              title={t("saveButton")}
              handleClick={() =>
                notificationCtx.showNotification({
                  message: "Informações salvas com sucesso.",
                  status: "success",
                })
              }
            />
          </div>
          <div className="marginTop15">
            <Button
              title={t("resetPasswordButton")}
              variant="outlined"
              handleClick={() =>
                notificationCtx.showNotification({
                  message: c("featureUnavailable"),
                  status: "warning",
                })
              }
            />
          </div>
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default Profile;
