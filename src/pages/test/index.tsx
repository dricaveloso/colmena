import { useState } from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { AlignItemsEnum, JustifyContentEnum } from "@/enums/index";
import WhiteSpaceFooter from "@/components/ui/WhiteSpaceFooter";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import PersonIcon from "@material-ui/icons/Person";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import SecurityIcon from "@material-ui/icons/Security";
import CloudCircleIcon from "@material-ui/icons/CloudCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import LanguageIcon from "@material-ui/icons/Language";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import UserAvatar from "@/components/pages/profile/Avatar";
import { useRouter } from "next/router";
import { signOut } from "next-auth/client";
import Backdrop from "@/components/ui/Backdrop";
import theme from "@/styles/theme";
import SwitchLanguageModal from "@/components/pages/profile/SwitchLanguageModal";
import { parseCookies } from "nookies";
import Switch from "@material-ui/core/Switch";
import { toast } from "@/utils/notifications";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["settings"])),
  },
});

const test_get = async () => {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then((json) => console.log(json));
};

const test_post = async () => {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify({
      title: "foo",
      body: "bar",
      userId: 1,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
};

function Test() {
  const { t } = useTranslation("settings");

  return (
    <LayoutApp title={t("title")} back>
      <p>estet</p>
      <button onClick={test_get}>bora get</button>
      <button onClick={test_post}>bora post</button>
      <WhiteSpaceFooter />
    </LayoutApp>
  );
}

export default Test;
