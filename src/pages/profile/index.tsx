import React, { useContext } from "react";
import FlexBox from "@/components/ui/FlexBox";
import LayoutApp from "@/components/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { makeStyles } from "@material-ui/styles";
import MaterialIcon from "@/components/ui/MaterialIcon";
import Text from "@/components/ui/Text";
import UserContext from "@/store/user-context";
import { GetStaticProps } from "next";
import { I18nInterface } from "@/interfaces/index";
import { JustifyContentEnum } from "@/enums/index";
import ProfileActions from "@/components/pages/profile/ProfileActions";
import Form from "@/components/pages/profile/Form";

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
  const userCtx = useContext(UserContext);
  const classes = useStyles();
  return (
    <LayoutApp title={t("title")}>
      <FlexBox justifyContent={JustifyContentEnum.FLEXSTART}>
        <ProfileActions />
        <div className={classes.marginInputDivs}>
          <div className="boxColumnCenter">
            <MaterialIcon icon="add_a_photo" style={{ fontSize: 120 }} />
            <Text>{userCtx.userInfo?.name}</Text>
          </div>
          <Form />
        </div>
      </FlexBox>
    </LayoutApp>
  );
}

export default Profile;
