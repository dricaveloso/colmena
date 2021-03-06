import React from "react";
import Box from "@material-ui/core/Box";
import ToolbarSection from "../ToolbarSection";
import HoneycombList from "./HoneycombList";
import Divider from "@/components/ui/Divider";
import { useTranslation } from "react-i18next";
import { getUsersConversations } from "@/services/talk/room";
import MembersList from "@/components/ui/skeleton/MembersList";
import { useDispatch } from "react-redux";
import { filterHoneycombs } from "@/pages/honeycomb";
import { RoomItemInterface } from "@/interfaces/talk";
import { setHoneycombs } from "@/store/actions/honeycomb/index";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/*";

export default function Section2() {
  const { t } = useTranslation("home");
  const { t: c } = useTranslation("common");
  const dispatch = useDispatch();
  const { data, error } = getUsersConversations({
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (!data && !error)
    return (
      <LayoutWrapper title={t("section3Title")}>
        <MembersList />
      </LayoutWrapper>
    );

  if (error || data.ocs.data.length === 0)
    return (
      <LayoutWrapper title={t("section3Title")}>
        <Box style={{ backgroundColor: "#fff" }} padding={2}>
          <Text style={{ textAlign: "left" }} variant={TextVariantEnum.BODY2}>
            {c("noItemsFound")}
          </Text>
        </Box>
      </LayoutWrapper>
    );

  const honeycombs: RoomItemInterface[] = filterHoneycombs(data.ocs.data);
  dispatch(setHoneycombs(honeycombs));

  return (
    <LayoutWrapper title={t("section3Title")}>
      <HoneycombList />
    </LayoutWrapper>
  );
}

type LayoutWrapperProps = {
  children: React.ReactNode;
  title: string;
};

function LayoutWrapper({ children, title }: LayoutWrapperProps) {
  return (
    <Box width="100%">
      <ToolbarSection title={title} link="/honeycomb" />
      <Divider marginTop={10} />
      {children}
    </Box>
  );
}
