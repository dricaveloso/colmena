import React from "react";
import Box from "@material-ui/core/Box";
import ToolbarSection from "../../home/ToolbarSection";
import GalleryHorizontalScroll from "@/components/ui/GalleryHorizontalScroll";
import Divider from "@/components/ui/Divider";
import { useTranslation } from "react-i18next";
import theme from "@/styles/theme";
import IconButton from "@/components/ui/IconButton";
import { isSubadminProfile } from "@/utils/permissions";
import { toast } from "@/utils/notifications";
import SocialMediaItem from "./SocialMediaItem";

export default function SocialMedia() {
  const { t } = useTranslation("common");

  return (
    <Box width="100%">
      <ToolbarSection
        showRightButton={false}
        // seeAllTitle={t("manageTitle")}
        title={t("socialMediaTitle")}
      />
      <Divider marginTop={10} />
      <Box
        width="100%"
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
        style={{ backgroundColor: "#fff" }}
        padding={1}
      >
        {isSubadminProfile() && (
          <IconButton
            icon="plus_circle"
            data-testid="add-social-media-media"
            iconColor={theme.palette.secondary.main}
            iconStyle={{ fontSize: 64 }}
            fontSizeIcon="large"
            handleClick={() => toast(t("featureUnavailable"), "warning")}
            style={{ marginRight: 8, marginBottom: 25 }}
            textStyle={{
              color: theme.palette.primary.dark,
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 14,
            }}
          />
        )}
        <GalleryHorizontalScroll>
          <SocialMediaItem
            title="facebook"
            icon="facebook_rounded"
            fontSize={64}
            iconColor="#343A40"
          />
          <SocialMediaItem
            title="twitter"
            icon="twitter_rounded"
            fontSize={64}
            iconColor="#343A40"
          />
        </GalleryHorizontalScroll>
      </Box>
    </Box>
  );
}
