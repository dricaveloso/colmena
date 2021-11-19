import React from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum } from "@/enums/index";
import WhiteSpaceFooter from "@/components/ui/WhiteSpaceFooter";
import HeaderMediaProfile from "@/components/pages/media-profile/Header";
import IconButton from "@/components/ui/IconButton";
import LatestPosts from "@/components/pages/home/Section2";
import Members from "@/components/pages/media-profile/Members";
import SocialMedia from "@/components/pages/media-profile/SocialMedia";
import Divider from "@/components/ui/Divider";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["mediaProfile", "drawer", "common"])),
  },
});

function MediaProfile() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const group =
    Array.isArray(userRdx.user.media?.groups) && userRdx.user.media?.groups[0]
      ? userRdx.user.media?.groups[0]
      : "";
  return (
    <LayoutApp
      title={userRdx.user.media?.name || ""}
      drawer={false}
      back
      extraElement={<IconButton icon="more_vertical" iconColor="#fff" fontSizeIcon="medium" />}
    >
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART} extraStyle={{ padding: 0, margin: 0 }}>
        <HeaderMediaProfile />
        <FlexBox
          justifyContent={JustifyContentEnum.FLEXSTART}
          extraStyle={{ paddingTop: 8, marginTop: 0 }}
        >
          <LatestPosts />
          {userRdx.user.subadmin.includes(group) && (
            <>
              <Divider marginTop={8} />
              <Members group={group} />
            </>
          )}
          <Divider marginTop={8} />
          <SocialMedia />
          <WhiteSpaceFooter />
        </FlexBox>
      </FlexBox>
    </LayoutApp>
  );
}

export default MediaProfile;
