import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import ToolbarSection from "../../home/ToolbarSection";
import GalleryHorizontalScroll from "./GalleryHorizontalScroll";
import Divider from "@/components/ui/Divider";
import { useTranslation } from "react-i18next";
import Invite from "@/components/pages/media-profile/Invite";

export default function Members() {
  const { t } = useTranslation("common");
  const [openInvite, setOpenInvite] = useState(false);
  return (
    <Box width="100%">
      <ToolbarSection
        seeAllTitle={t("manageTitle")}
        title={t("membersTitle")}
        link="/algum-lugar"
      />
      <Divider marginTop={10} />
      <GalleryHorizontalScroll handleOpenInviteForm={() => setOpenInvite(true)} />
      {openInvite && (
        <Invite openInviteForm={openInvite} handleCloseInviteForm={() => setOpenInvite(false)} />
      )}
    </Box>
  );
}
