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
import Modal from "@/components/ui/Modal";
import { getSystemLanguages } from "@/utils/utils";
import { LanguageProps, LanguagesAvailableProps } from "@/types/*";
import constants from "@/constants/index";

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

  const changeLanguageHandler = async (locale: LanguagesAvailableProps) => {
    if (defaultLang !== locale) {
      setShowBackdrop(true);
      setCookie(null, "NEXT_LOCALE", locale, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      await localStorage.setItem("isChangedLanguage", "yes");
      try {
        const localesNextcloud = constants.LOCALES_NEXTCLOUD;
        if (localesNextcloud[locale]) {
          await updateUser<string>("language", localesNextcloud[locale]);
        }
      } catch (e) {
        console.log(e);
        // idioma não existe no NC
      }
      setShowBackdrop(false);
      await router.push(backUrl, "", {
        locale,
      });
      router.reload();
    }
  };

  return (
    <Modal title={t("titleSwitchLanguage")} open={open} handleClose={onClose}>
      <Backdrop open={showBackdrop} />
      <List>
        {getSystemLanguages(t).map((item: LanguageProps, idx: number) => (
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
