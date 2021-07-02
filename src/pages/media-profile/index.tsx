import React, { useState, useContext } from "react";
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
import InviteForm from "component/pages/media-profile/Invite";
import NotificationContext from "store/notification-context";
import SocialMediaIconButton from "component/statefull/SocialMediaIconButtons";
import { GetStaticProps } from "next";
import { I18nInterface } from "interfaces";
import {
  JustifyContentEnum,
  NotificationStatusEnum,
  SelectVariantEnum,
  TextVariantEnum,
} from "enums";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["mediaProfile", "drawer", "common"])),
    },
  };
};

const useStyles = makeStyles({
  marginInputDivs: {
    "& > *": {
      marginBottom: 25,
    },
  },
});

function Profile() {
  const { t } = useTranslation("mediaProfile");
  const { t: c } = useTranslation("common");
  const notificationCtx = useContext(NotificationContext);
  const [openInviteForm, setOpenInviteForm] = useState(false);
  const classes = useStyles();
  return (
    <LayoutApp title={t("title")} back={true}>
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART}>
        <div className={classes.marginInputDivs}>
          <div className="boxColumnCenter">
            <MaterialIcon
              onClick={() =>
                notificationCtx.showNotification({
                  message: c("featureUnavailable"),
                  status: NotificationStatusEnum.SUCCESS,
                })
              }
              icon="add_a_photo"
              style={{ fontSize: 120 }}
            />
            <Text>{t("name")}</Text>
          </div>
          <TextField
            id="description"
            label={t("descriptionTitle")}
            multiline={true}
            variant={SelectVariantEnum.OUTLINED}
          />
          <div className="boxGridTwoColumns">
            <IconButton
              fontSizeIcon="2.1em"
              title={t("textEditCollaborators")}
              color="black"
              icon="edit_note"
              variantTitle={TextVariantEnum.BODY2}
              handleClick={() =>
                notificationCtx.showNotification({
                  message: c("featureUnavailable"),
                  status: NotificationStatusEnum.WARNING,
                })
              }
            />
            <IconButton
              fontSizeIcon="2.1em"
              title={t("textInviteCollaborators")}
              color="black"
              icon="group_add"
              variantTitle={TextVariantEnum.BODY2}
              handleClick={() => setOpenInviteForm(true)}
            />
            <InviteForm
              openInviteForm={openInviteForm}
              handleCloseInviteForm={() => setOpenInviteForm(false)}
            />
          </div>
          <Text>{t("socialMediaTitle")}</Text>
          <div className="boxRowCenter marginTop15">
            <SocialMediaIconButton />
          </div>
          <div className="marginTop15">
            <Button
              title={t("textSaveButton")}
              handleClick={() =>
                notificationCtx.showNotification({
                  message: t("messageSuccessInformation"),
                  status: NotificationStatusEnum.SUCCESS,
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
