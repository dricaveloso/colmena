import React, { useContext } from "react";
import { useTranslation } from "next-i18next";
import TextField from "@/components/ui/TextField";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import NotificationContext from "@/store/notification-context";
import SocialMediaIconButton from "@/components/statefull/SocialMediaIconButtons";
import { ButtonVariantEnum, NotificationStatusEnum, SelectVariantEnum } from "@/enums/index";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  marginInputDivs: {
    "& > div": {
      marginBottom: 15,
    },
  },
});

export default function Form() {
  const { t } = useTranslation("profile");
  const { t: c } = useTranslation("common");
  const notificationCtx = useContext(NotificationContext);
  const classes = useStyles();

  return (
    <div className={classes.marginInputDivs}>
      <TextField id="name" label={t("nameField")} variant={SelectVariantEnum.OUTLINED} />
      <TextField id="email" label={t("emailField")} variant={SelectVariantEnum.OUTLINED} />
      <TextField id="url_blog" label={t("urlField")} variant={SelectVariantEnum.OUTLINED} />

      <Text>{t("socialMediaTitle")}</Text>
      <div className="boxRowCenter marginTop15">
        <SocialMediaIconButton />
      </div>
      <div className="marginTop15">
        <Button
          title={t("saveButton")}
          handleClick={() =>
            notificationCtx.showNotification({
              message: t("successMessage"),
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
  );
}
