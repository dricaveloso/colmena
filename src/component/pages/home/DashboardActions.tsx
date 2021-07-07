import React, { useContext } from "react";
import IconButton from "component/ui/IconButton";
import { Fade, Divider } from "@material-ui/core";
import NotificationContext from "store/notification-context";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import MediaAvatar from "component/pages/home/MediaAvatar";
import GreetingMessage from "component/pages/home/GreetingMessage";
import RecentPublications from "component/pages/home/RecentPublications";
import { TextVariantEnum, NotificationStatusEnum } from "enums";

type Props = {
  showContent: boolean;
  isFirstAccess: boolean;
};

function DashboardActions({ showContent, isFirstAccess }: Props) {
  const router = useRouter();
  const notificationCtx = useContext(NotificationContext);
  const { t } = useTranslation("home");
  const { t: d } = useTranslation("drawer");
  const { t: c } = useTranslation("common");

  const navigate = (url: string) => {
    router.push(url);
  };

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
          <GreetingMessage fontSize={16} />
        </div>

        <div className="boxRowSpaceAround">
          <IconButton
            title={d("myFilesTitle")}
            variantTitle={TextVariantEnum.BODY2}
            icon="cloud"
            fontSizeIcon="1.5em"
            handleClick={() => navigate("/library")}
          />
          <IconButton
            title={d("communityTitle")}
            variantTitle={TextVariantEnum.BODY2}
            icon="public"
            fontSizeIcon="1.5em"
            handleClick={() =>
              notificationCtx.showNotification({
                message: c("featureUnavailable"),
                status: NotificationStatusEnum.WARNING,
              })
            }
          />
        </div>
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <IconButton
            title={t("recordText")}
            variantTitle={TextVariantEnum.BODY2}
            icon="mic"
            fontSizeIcon="2.3em"
            handleClick={() => navigate("/conference")}
            color="red"
          />
        </div>
        <div className="boxRowSpaceAround">
          <IconButton
            title={d("editTextTitle")}
            variantTitle={TextVariantEnum.BODY2}
            icon="edit"
            fontSizeIcon="1.5em"
            handleClick={() =>
              notificationCtx.showNotification({
                message: c("featureUnavailable"),
                status: NotificationStatusEnum.WARNING,
              })
            }
          />
          <IconButton
            title={d("editAudioTitle")}
            variantTitle={TextVariantEnum.BODY2}
            icon="crop"
            fontSizeIcon="1.5em"
            handleClick={() => navigate("/edit-audio")}
          />
        </div>

        <Divider variant="fullWidth" style={{ marginTop: 30 }} />
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
