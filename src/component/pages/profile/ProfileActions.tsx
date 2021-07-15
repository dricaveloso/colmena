import React, { useState } from "react";
import IconButton from "@/components/ui/IconButton";
import { TextVariantEnum } from "@/enums/index";
import { useTranslation } from "next-i18next";
import SwitchLanguageModal from "@/components/pages/profile/SwitchLanguageModal";
import { parseCookies } from "nookies";

export default function ProfileActions() {
  const { t } = useTranslation("profile");
  const cookies = parseCookies();
  const [open, setOpen] = useState(false);

  const switchLanguageHandle = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        top: 0,
        right: 0,
        marginTop: 70,
        marginRight: 10,
      }}
    >
      <IconButton
        fontSizeIcon="small"
        title={t("mediaTitle")}
        color="black"
        icon="settings"
        url="/media-profile"
        variantTitle={TextVariantEnum.BODY2}
      />
      <IconButton
        fontSizeIcon="small"
        title={t("switchLanguage")}
        color="black"
        icon="language"
        handleClick={switchLanguageHandle}
        variantTitle={TextVariantEnum.BODY2}
      />
      <SwitchLanguageModal defaultLang={cookies.NEXT_LOCALE} open={open} onClose={handleClose} />
    </div>
  );
}
