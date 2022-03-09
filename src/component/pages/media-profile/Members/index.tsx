import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import ToolbarSection from "../../home/ToolbarSection";
import GalleryHorizontalScroll from "@/components/ui/GalleryHorizontalScroll";
import Divider from "@/components/ui/Divider";
import { useTranslation } from "react-i18next";
import Invite from "@/components/pages/media-profile/Members/Invite";
import theme from "@/styles/theme";
import IconButton from "@/components/ui/IconButton";
import { getSpecificGroup } from "@/services/ocs/groups";
import Member from "@/components/pages/media-profile/Members/Member";
import { v4 as uuid } from "uuid";
import MembersSkeleton from "@/components/ui/skeleton/MembersList";
import { getUserGroup, isSubadminProfile } from "@/utils/permissions";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  membersWrapped: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    padding: 1,
  },
  plusButton: {
    marginRight: 8,
    marginBottom: 25,
  },
}));

export default function Members() {
  const classes = useStyles();
  const { t } = useTranslation("common");
  const [openInvite, setOpenInvite] = useState(false);
  const group = getUserGroup();
  const { data, error } = getSpecificGroup(group);

  return (
    <Box width="100%">
      <ToolbarSection title={t("membersTitle")} showRightButton={false} />
      <Divider marginTop={10} />
      <Box className={classes.membersWrapped}>
        {isSubadminProfile() && (
          <IconButton
            icon="plus_circle"
            iconColor={theme.palette.variation1.main}
            iconStyle={{ fontSize: 64 }}
            fontSizeIcon="large"
            data-testid="add-member-media"
            handleClick={() => setOpenInvite(true)}
            className={classes.plusButton}
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
