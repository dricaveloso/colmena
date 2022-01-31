import React, { useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { v4 as uuid } from "uuid";
import { setCookie } from "nookies";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { updateUser } from "@/services/ocs/users";
import Backdrop from "@/components/ui/Backdrop";
import constants from "@/constants/index";

type LanguageProps = {
  abbr: string;
  language: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  defaultLang: string | undefined;
  backUrl: string;
};

export default function SwitchLanguageModal({ open, onClose, defaultLang, backUrl }: Props) {
  const router = useRouter();
  const [showBackdrop, setShowBackdrop] = useState(false);
  const { t } = useTranslation("common");

  const locales = Object.values(constants.LOCALES);
  const languages: LanguageProps[] = locales.map((item) => ({
    abbr: item,
    language: t(`languagesAllowed.${item}`),
  }));

  const changeLanguageHandler = async (locale: string) => {
    if (defaultLang !== locale) {
      setShowBackdrop(true);
      setCookie(null, "NEXT_LOCALE", locale, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      await updateUser<string>("language", locale);
      setShowBackdrop(false);
      router.push(backUrl, "", {
        locale,
      });
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={onClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <Backdrop open={showBackdrop} />
      <DialogTitle id="simple-dialog-title">{t("titleSwitchLanguage")}</DialogTitle>
      <List>
        {languages.map((item: LanguageProps) => (
          <ListItem button onClick={() => changeLanguageHandler(item.abbr)} key={uuid()}>
            <ListItemText primary={item.language} />
            {!!defaultLang && defaultLang === item.abbr && (
              <ListItemSecondaryAction>
                <CheckCircleIcon style={{ color: "green" }} />
              </ListItemSecondaryAction>
            )}
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
