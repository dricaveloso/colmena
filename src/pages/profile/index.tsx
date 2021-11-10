import React from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum } from "@/enums/index";
import Form from "@/components/pages/profile/Form";
import WhiteSpaceFooter from "@/components/ui/WhiteSpaceFooter";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";
import HeaderProfile from "@/components/pages/profile/Header";
import { capitalizeFirstLetter } from "@/utils/utils";
import IconButton from "@/components/ui/IconButton";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["profile", "drawer", "common"])),
  },
});

function Profile() {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  return (
    <LayoutApp
      title={capitalizeFirstLetter(userRdx.user.name)}
      back
      templateHeader="variation2"
      drawer={false}
      extraElement={<IconButton icon="more_vertical" iconColor="#fff" fontSizeIcon="medium" />}
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
