import React from "react";
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

type LanguageProps = {
  abbr: string;
  language: string;
};

const languages: LanguageProps[] = [
  {
    abbr: "en",
    language: "English",
  },
  {
    abbr: "es",
    language: "Spanish",
  },
  {
    abbr: "fr",
    language: "French",
  },
];

type Props = {
  open: boolean;
  onClose: () => void;
  defaultLang: string | undefined;
  backUrl: string;
};

export default function SwitchLanguageModal({ open, onClose, defaultLang, backUrl }: Props) {
  const router = useRouter();
  const { t } = useTranslation("common");

  const changeLanguageHandler = (locale: string) => {
    if (defaultLang !== locale) {
      setCookie(null, "NEXT_LOCALE", locale, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
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
