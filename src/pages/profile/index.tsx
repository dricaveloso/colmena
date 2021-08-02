import React from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { makeStyles } from "@material-ui/styles";
import MaterialIcon from "@/components/ui/MaterialIcon";
import Text from "@/components/ui/Text";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum } from "@/enums/index";
import ProfileActions from "@/components/pages/profile/ProfileActions";
import Form from "@/components/pages/profile/Form";
import WhiteSpaceFooter from "@/components/ui/WhiteSpaceFooter";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";

export const getStaticProps: GetStaticProps = async ({ locale }: I18nInterface) => ({
  props: {
    ...(await serverSideTranslations(locale, ["profile", "drawer", "common"])),
  },
});

const useStyles = makeStyles({
  marginInputDivs: {
    "& > div": {
      marginBottom: 15,
    },
  },
});

function Profile() {
  const { t } = useTranslation("profile");
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const classes = useStyles();
  return (
    <LayoutApp title={t("title")}>
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART}>
        <ProfileActions />
        <div className="width-based-device">
          <div className={classes.marginInputDivs}>
            <div className="boxColumnCenter">
              <MaterialIcon icon="add_a_photo" style={{ fontSize: 120 }} />
              <Text>{userRdx.user.name}</Text>
            </div>
            <Form />
          </div>
        </div>
        <WhiteSpaceFooter />
      </FlexBox>
    </LayoutApp>
  );
}

export default Profile;
