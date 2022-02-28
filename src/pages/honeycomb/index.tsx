import React from "react";
import LayoutApp from "@/components/statefull/LayoutApp";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import FlexBox from "@/components/ui/FlexBox";
import Box from "@material-ui/core/Box";
import HoneycombList from "@/components/pages/honeycomb/ItemList";
import { JustifyContentEnum } from "@/enums/index";
import { getUsersConversations } from "@/services/talk/room";
import { useTranslation } from "next-i18next";
import FileListSkeleton from "@/components/ui/skeleton/FileList";
import { setHoneycombs } from "@/store/actions/honeycomb/index";
import { useDispatch } from "react-redux";
import AlertInfoCenter from "@/components/ui/AlertInfoCenter";
import { RoomItemInterface } from "@/interfaces/talk";
// import Tabs from "@material-ui/core/Tabs";
// import Tab from "@material-ui/core/Tab";
// import SwipeableViews from "react-swipeable-views";
// import theme from "@/styles/theme";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["honeycomb"])),
  },
});

export const filterHoneycombs = (honeycombs: RoomItemInterface[]) => {
  if (!honeycombs) {
    return honeycombs;
  }

  return honeycombs.filter((honeycomb: RoomItemInterface) => honeycomb.type !== 4);
};

export default function Honeycomb() {
  const dispatch = useDispatch();
  const { data, error } = getUsersConversations();

  if (!data && !error)
    return (
      <LayoutWrapper>
        <FileListSkeleton />
      </LayoutWrapper>
    );

  if (error)
    return (
      <LayoutWrapper>
        <AlertInfoCenter />
      </LayoutWrapper>
    );

  const orderByLastActivity = (a: RoomItemInterface, b: RoomItemInterface) =>
    a.lastActivity - b.lastActivity;

  const honeycombs: RoomItemInterface[] = filterHoneycombs(data.ocs.data);

  dispatch(setHoneycombs(honeycombs.sort(orderByLastActivity)));

  return (
    <LayoutWrapper>
      <HoneycombList />
    </LayoutWrapper>
  );
}

type LayoutWrapperProps = {
  children: React.ReactNode;
};

function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { t } = useTranslation("honeycomb");

  return (
    <LayoutApp title={t("title")}>
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART} extraStyle={{ padding: 0, margin: 0 }}>
        <Box width="100%">{children}</Box>
      </FlexBox>
    </LayoutApp>
  );
}
