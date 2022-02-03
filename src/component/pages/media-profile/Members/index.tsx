import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import ToolbarSection from "../../home/ToolbarSection";
import GalleryHorizontalScroll from "@/components/ui/GalleryHorizontalScroll";
import Divider from "@/components/ui/Divider";
import { useTranslation } from "react-i18next";
import Invite from "@/components/pages/media-profile/Invite";
import theme from "@/styles/theme";
import IconButton from "@/components/ui/IconButton";
import { getSpecificGroup } from "@/services/ocs/groups";
import Member from "@/components/pages/media-profile/Members/Member";
import { v4 as uuid } from "uuid";
import MembersSkeleton from "@/components/ui/skeleton/MembersList";
import { getUserGroup, isSubadminProfile } from "@/utils/permissions";

export default function Members() {
  const { t } = useTranslation("common");
  const [openInvite, setOpenInvite] = useState(false);
  const group = getUserGroup();
  const { data, error } = getSpecificGroup(group);

  return (
    <Box width="100%">
      <ToolbarSection
        // seeAllTitle={t("manageTitle")}
        title={t("membersTitle")}
        showRightButton={false}
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
            iconColor={theme.palette.variation1.main}
            iconStyle={{ fontSize: 64 }}
            fontSizeIcon="large"
            data-testid="add-member-media"
            handleClick={() => setOpenInvite(true)}
            style={{ marginRight: 8, marginBottom: 25 }}
            textStyle={{
              color: theme.palette.primary.dark,
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 14,
            }}
          />
        )}
        {!data && !error ? (
          <MembersSkeleton />
        ) : (
          <GalleryHorizontalScroll>
            {data.ocs.data.users
              .filter((item) => item !== "admin")
              .map((item) => (
                <div key={uuid()}>
                  <Member title={item} />
                </div>
              ))}
          </GalleryHorizontalScroll>
        )}
      </Box>
      {openInvite && (
        <Invite openInviteForm={openInvite} handleCloseInviteForm={() => setOpenInvite(false)} />
      )}
    </Box>
  );
}
