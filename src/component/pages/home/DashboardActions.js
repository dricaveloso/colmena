import React, { useContext } from "react";
import IconButton from "component/ui/IconButton";
import { Fade, Divider } from "@material-ui/core";
import NotificationContext from "store/notification-context";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import MediaAvatar from "component/pages/home/MediaAvatar";
import theme from "styles/theme";
import RecentPublications from "component/pages/home/RecentPublications";

function DashboardActions({ showContent, isFirstAccess }) {
  const router = useRouter();
  const notificationCtx = useContext(NotificationContext);
  const { t } = useTranslation("home");
  const { t: d } = useTranslation("drawer");
  const { t: c } = useTranslation("common");

  function getContent() {
    return (
      <div>
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
          <MediaAvatar size={12} />
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
            handleClick={() =>
              notificationCtx.showNotification({
                message: c("featureUnavailable"),
                status: "warning",
              })
            }
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
            handleClick={() =>
              notificationCtx.showNotification({
                message: c("featureUnavailable"),
                status: "warning",
              })
            }
          />
          <IconButton
            title={d("editAudioTitle")}
            variantTitle="p"
            icon="crop"
            fontSizeIcon="1.5em"
            handleClick={() => router.push("/edit-audio")}
          />
        </div>

        <Divider elevation={3} style={{ marginTop: 30, width: "100%" }} />
        <RecentPublications />
      </div>
    );
  }

  if (isFirstAccess)
    return (
      <Fade in={showContent} timeout={500}>
        {getContent()}
      </Fade>
    );

  return getContent();
}

export default DashboardActions;
