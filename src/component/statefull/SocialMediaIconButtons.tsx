import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";
import { toast } from "@/utils/notifications";
import { useTranslation } from "next-i18next";

function SocialMediaIconButton() {
  const { t: c } = useTranslation("common");

  return (
    <>
      <FacebookIcon
        onClick={() => toast(c("featureUnavailable"), "warning")}
        className="marginRight15"
        style={{ fontSize: 50 }}
      />
      <WhatsAppIcon
        onClick={() => toast(c("featureUnavailable"), "warning")}
        className="marginRight15"
        style={{ fontSize: 50 }}
      />
      <InstagramIcon
        onClick={() => toast(c("featureUnavailable"), "warning")}
        className="marginRight15"
        style={{ fontSize: 50 }}
      />
    </>
  );
}

export default SocialMediaIconButton;
