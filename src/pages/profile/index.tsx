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
import { GetStaticProps } from "next";
import { I18nInterface } from "interfaces";
import {
  ButtonVariantEnum,
  JustifyContentEnum,
  NotificationStatusEnum,
  SelectVariantEnum,
  TextVariantEnum,
} from "enums";

export const getStaticProps: GetStaticProps = async ({
  locale,
}: I18nInterface) => {
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

  const navigate = () => {
    router.push("/media-profile");
  };

  return (
    <LayoutApp title={t("title")} back={true}>
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART}>
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
            handleClick={navigate}
            variantTitle={TextVariantEnum.BODY2}
          />
        </div>
        <div className={classes.marginInputDivs}>
          <div className="boxColumnCenter">
            <MaterialIcon icon="add_a_photo" style={{ fontSize: 120 }} />
            <Text>Makena</Text>
          </div>
          <TextField
            id="name"
            label={t("nameField")}
            variant={SelectVariantEnum.OUTLINED}
          />
          <TextField
            id="email"
            label={t("emailField")}
            variant={SelectVariantEnum.OUTLINED}
          />
          <TextField
            id="url_blog"
            label={t("urlField")}
            variant={SelectVariantEnum.OUTLINED}
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
                  status: NotificationStatusEnum.SUCCESS,
                })
              }
            />
          </div>
          <div className="marginTop15">
            <Button
              title={t("resetPasswordButton")}
              variant={ButtonVariantEnum.OUTLINED}
              handleClick={() =>
                notificationCtx.showNotification({
                  message: c("featureUnavailable"),
                  status: NotificationStatusEnum.WARNING,
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
