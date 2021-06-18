import React from "react";
import FlexBox from "component/ui/FlexBox";
import LayoutApp from "component/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TextField from "component/ui/TextField";
import { makeStyles } from "@material-ui/styles";
import MaterialIcon from "component/ui/MaterialIcon";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";
import Text from "component/ui/Text";
import Button from "component/ui/Button";
import IconButton from "component/ui/IconButton";
import { useRouter } from "next/router";

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["profile", "drawer"])),
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
            <Text>Juan</Text>
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
            <FacebookIcon className="marginRight15" style={{ fontSize: 50 }} />
            <WhatsAppIcon className="marginRight15" style={{ fontSize: 50 }} />
            <InstagramIcon className="marginRight15" style={{ fontSize: 50 }} />
          </div>
          <div className="marginTop15">
            <Button title={t("editButton")} />
          </div>
          <div className="marginTop15">
            <Button title={t("resetPasswordButton")} variant="outlined" />
          </div>
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default Profile;
