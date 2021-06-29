import { useContext } from "react";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";
import NotificationContext from "store/notification-context";
import { useTranslation } from "next-i18next";

function SocialMediaIconButton() {
  const { t: c } = useTranslation("common");
  const notificationCtx = useContext(NotificationContext);

  return (
    <>
      <FacebookIcon
        onClick={() =>
          notificationCtx.showNotification({
            message: c("featureUnavailable"),
            status: "warning",
          })
        }
        className="marginRight15"
        style={{ fontSize: 50 }}
      />
      <WhatsAppIcon
        onClick={() =>
          notificationCtx.showNotification({
            message: c("featureUnavailable"),
            status: "warning",
          })
        }
        className="marginRight15"
        style={{ fontSize: 50 }}
      />
      <InstagramIcon
        onClick={() =>
          notificationCtx.showNotification({
            message: c("featureUnavailable"),
            status: "warning",
          })
        }
        className="marginRight15"
        style={{ fontSize: 50 }}
      />
    </>
  );
}

export default SocialMediaIconButton;