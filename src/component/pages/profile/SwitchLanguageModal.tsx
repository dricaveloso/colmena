import React, { useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { v4 as uuid } from "uuid";
import { setCookie } from "nookies";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { updateUser } from "@/services/ocs/users";
import Backdrop from "@/components/ui/Backdrop";
import constants from "@/constants/index";
import Modal from "@/components/ui/Modal";

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
    <Modal title={t("titleSwitchLanguage")} open={open} handleClose={onClose}>
      <Backdrop open={showBackdrop} />
      <List>
        {languages.map((item: LanguageProps, idx: number) => (
          <ListItem
            style={{ backgroundColor: idx % 2 === 0 ? "#f2f2f2" : "#fff" }}
            button
            onClick={() => changeLanguageHandler(item.abbr)}
            key={uuid()}
          >
            <ListItemText primary={item.language} />
            {!!defaultLang && defaultLang === item.abbr && (
              <ListItemSecondaryAction>
                <CheckCircleIcon style={{ color: "green" }} />
              </ListItemSecondaryAction>
            )}
          </ListItem>
        ))}
      </List>
    </Modal>
  );
}
