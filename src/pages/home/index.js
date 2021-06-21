import React from "react";
import FlexBox from "component/ui/FlexBox";
import IconButton from "component/ui/IconButton";
import { useRouter } from "next/router";
import LayoutApp from "component/statefull/LayoutApp";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Avatar, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import RecentPublications from "component/pages/home/RecentPublications";

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["home", "drawer"])),
    },
  };
};

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));

function Home() {
  const router = useRouter();
  const classes = useStyles();
  const { t } = useTranslation("home");
  const { t: d } = useTranslation("drawer");

  return (
    <LayoutApp title="MAIA" back={true}>
      <FlexBox justifyContent="flex-start">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <Avatar
            alt="Remy Sharp"
            src="images/radio_image.jpg"
            className={classes.large}
          />
          <span>{t("mediaName")}</span>
        </div>

        <div className="boxRowSpaceAround">
          <IconButton
            title={t("mediaCloudName")}
            variantTitle="p"
            icon="cloud"
            fontSizeIcon="1.5em"
            handleClick={() => router.push("/mediateca")}
          />
          <IconButton
            title={d("communityTitle")}
            variantTitle="p"
            icon="public"
            fontSizeIcon="1.5em"
          />
        </div>
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <IconButton
            title={t("recordText")}
            variantTitle="p"
            icon="mic"
            fontSizeIcon="2.3em"
            handleClick={() => router.push("/record")}
            color="red"
          />
        </div>
        <div className="boxRowSpaceAround">
          <IconButton
            title={d("editTextTitle")}
            variantTitle="p"
            icon="edit"
            fontSizeIcon="1.5em"
            handleClick={() => router.push("/mediateca")}
          />
          <IconButton
            title={d("editAudioTitle")}
            variantTitle="p"
            icon="crop"
            fontSizeIcon="1.5em"
          />
        </div>
        <Divider elevation={3} style={{ marginTop: 30, width: "100%" }} />
        <RecentPublications />
      </FlexBox>
    </LayoutApp>
  );
}

export default Home;
