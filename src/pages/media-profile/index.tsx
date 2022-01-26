import React from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum } from "@/enums/index";
import WhiteSpaceFooter from "@/components/ui/WhiteSpaceFooter";
import HeaderMediaProfile from "@/components/pages/media-profile/Header";
import Members from "@/components/pages/media-profile/Members";
import SocialMedia from "@/components/pages/media-profile/SocialMedia";
import Divider from "@/components/ui/Divider";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import { isSubadminProfile } from "@/utils/permissions";
import ContextMenuMediaProfile from "@/components/pages/media-profile/ContextMenu";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["mediaProfile"])),
  },
});

function MediaProfile() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  return (
    <LayoutApp
      title={userRdx.user.media?.name || ""}
      drawer={false}
      back
      extraElement={<ContextMenuMediaProfile />}
    >
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART} extraStyle={{ padding: 0, margin: 0 }}>
        <HeaderMediaProfile />
        <FlexBox
          justifyContent={JustifyContentEnum.FLEXSTART}
          extraStyle={{ paddingTop: 8, marginTop: 0 }}
        >
          {isSubadminProfile() && (
            <>
              <Divider marginTop={8} />
              <Members />
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
