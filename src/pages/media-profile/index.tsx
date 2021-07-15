import React, { useState, useContext } from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TextField from "@/components/ui/TextField";
import { makeStyles } from "@material-ui/styles";
import MaterialIcon from "@/components/ui/MaterialIcon";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import InviteForm from "@/components/pages/media-profile/Invite";
import NotificationContext from "@/store/notification-context";
import SocialMediaIconButton from "@/components/statefull/SocialMediaIconButtons";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import {
  JustifyContentEnum,
  NotificationStatusEnum,
  SelectVariantEnum,
  TextVariantEnum,
} from "@/enums/index";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["mediaProfile", "drawer", "common"])),
  },
});

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
    <LayoutApp title={t("title")}>
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
            multiline
            variant={SelectVariantEnum.OUTLINED}
          />
          <div className="boxGridTwoColumns">
            <IconButton
              iconStyle={{ fontSize: "3.5em" }}
              title={t("textEditCollaborators")}
              icon="dropdown_checklist"
              variantTitle={TextVariantEnum.BODY2}
              handleClick={() =>
                notificationCtx.showNotification({
                  message: c("featureUnavailable"),
                  status: NotificationStatusEnum.WARNING,
                })
              }
            />
            <IconButton
              iconStyle={{ fontSize: "3.5em" }}
              title={t("textInviteCollaborators")}
              icon="add_user"
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
