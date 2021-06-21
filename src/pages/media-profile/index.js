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
import Select from "component/ui/Select";

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["mediaProfile", "drawer"])),
    },
  };
};

const useStyles = makeStyles((theme) => ({
  marginInputDivs: {
    "& > *": {
      marginBottom: 25,
    },
  },
}));

function Profile() {
  const { t } = useTranslation("mediaProfile");
  const classes = useStyles();
  return (
    <LayoutApp title={t("title")} back={true}>
      <FlexBox justifyContent="flex-start">
        <div className={classes.marginInputDivs}>
          <div className="boxColumnCenter">
            <MaterialIcon icon="add_a_photo" style={{ fontSize: 120 }} />
            <Text>{t("name")}</Text>
          </div>
          <TextField
            id="description"
            label={t("descriptionTitle")}
            multiline={true}
            variant="outlined"
          />
          <div className="boxGridTwoColumns">
            <IconButton
              fontSizeIcon="2.1em"
              title={t("textEditCollaborators")}
              color="black"
              icon="edit_note"
              handleClick={() => router.push("/media-profile")}
            />
            <IconButton
              fontSizeIcon="2.1em"
              title={t("textInviteCollaborators")}
              color="black"
              icon="group_add"
              handleClick={() => router.push("/media-profile")}
            />
          </div>
          <div className="boxColumnCenter">
            <Select label={t("user1")} id="1" />
            <div className="marginTop15"></div>
            <Select label={t("user2")} id="2" />
          </div>
          <Text>{t("socialMediaTitle")}</Text>
          <div className="boxRowCenter marginTop15">
            <FacebookIcon className="marginRight15" style={{ fontSize: 50 }} />
            <WhatsAppIcon className="marginRight15" style={{ fontSize: 50 }} />
            <InstagramIcon className="marginRight15" style={{ fontSize: 50 }} />
          </div>
          <div className="marginTop15">
            <Button title={t("textSaveButton")} />
          </div>
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default Profile;
