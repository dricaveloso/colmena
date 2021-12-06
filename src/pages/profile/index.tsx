import React from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum } from "@/enums/index";
import Form from "@/components/pages/profile/Form";
import WhiteSpaceFooter from "@/components/ui/WhiteSpaceFooter";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import HeaderProfile from "@/components/pages/profile/Header";
import { getFirstname } from "@/utils/utils";
import serverSideTranslations from "@/extensions/next-i18next/serverSideTranslations";
import ContextMenuProfile from "@/components/pages/profile/ContextMenu";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["profile"])),
  },
});

function Profile() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  return (
    <LayoutApp
      title={getFirstname(userRdx.user.name)}
      back
      drawer={false}
      extraElement={<ContextMenuProfile />}
    >
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART} extraStyle={{ padding: 0, margin: 0 }}>
        <HeaderProfile />
        <FlexBox
          justifyContent={JustifyContentEnum.FLEXSTART}
          extraStyle={{ paddingTop: 25, marginTop: 0 }}
        >
          <div className="width-based-device">
            <Form />
          </div>
          <WhiteSpaceFooter />
        </FlexBox>
      </FlexBox>
    </LayoutApp>
  );
}

export default Profile;
