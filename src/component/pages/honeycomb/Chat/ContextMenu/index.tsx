/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-bind */
import React, { useState } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import IconButton from "@/components/ui/IconButton";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import { toast } from "@/utils/notifications";
import ContextMenuItem from "@/components/ui/ContextMenuItem";
import { listUsersByGroup } from "@/services/ocs/groups";
import { getUserGroup } from "@/utils/permissions";
import { PermissionTalkMemberEnum, HoneycombContextOptions } from "@/enums/*";
import { PropsUserSelector } from "@/types/index";
import { useSelector } from "react-redux";
import { getRoomParticipants, removeYourselfFromAConversation } from "@/services/talk/room";
import Backdrop from "@/components/ui/Backdrop";
import theme from "@/styles/theme";
import Drawer from "@material-ui/core/Drawer";
// eslint-disable-next-line import/no-cycle
import Participants from "./Participants";
import ModalAddParticipant from "./ModalAddParticipant";
import { RoomParticipant } from "@/interfaces/talk";

type PositionProps = {
  mouseX: null | number;
  mouseY: null | number;
};

type Props = {
  token: string;
  handleFallbackLeaveConversation?: (() => void) | null;
  iconColor?: string;
  blackList?: string[];
};

export const isModerator = (participantsIn: RoomParticipant[], userId: string) => {
  const result = participantsIn.find(
    (item) =>
      item.actorId === userId &&
      (item.participantType === PermissionTalkMemberEnum.OWNER ||
        item.participantType === PermissionTalkMemberEnum.MODERATOR),
  );
  return result;
};

const ContextMenuOptions = ({
  token,
  handleFallbackLeaveConversation = null,
  iconColor = "#fff",
  blackList = [],
}: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const { t } = useTranslation("honeycomb");
  const { t: c } = useTranslation("common");
  const [openAddParticipant, setOpenAddParticipant] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [tokenUuid, setTokenUuid] = useState(uuid());
  const [position, setPosition] = useState<PositionProps>({
    mouseX: null,
    mouseY: null,
  });

  const group = getUserGroup();

  const { data } = listUsersByGroup(group, tokenUuid, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const { data: part } = getRoomParticipants(token, tokenUuid, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  let participantsIn: RoomParticipant[] = [];
  let participantsOut: string[] = [];
  if (data && data.ocs && part && part.ocs) {
    participantsIn = part.ocs.data;
    const honeycombParticipants = part.ocs.data.map((item) => item.actorId);
    participantsOut = data.ocs.data.users.filter(
      (item) => ![userRdx.user.id, "admin", ...honeycombParticipants].includes(item),
    );
  }

  const handleOpenContextMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
    setPosition({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleCloseContextMenu = () => {
    setAnchorEl(null);
  };

  async function handleLeaveConversation() {
    try {
      setShowBackdrop(true);
      handleCloseContextMenu();
      await removeYourselfFromAConversation(token);
      toast(c("doneMessage"), "success");
      if (handleFallbackLeaveConversation) handleFallbackLeaveConversation();
    } catch (e) {
      console.log(e);
      toast(c("genericErrorMessage"), "error");
    } finally {
      setShowBackdrop(false);
    }
  }

  const handleOpenParticipantModal = () => {
    handleCloseContextMenu();
    setOpenAddParticipant(true);
  };

  const unavailable = () => {
    toast(c("featureUnavailable"), "warning");
  };

  return (
    <Box display="flex" justifyContent="flex-end">
      <Backdrop open={showBackdrop} />
      <IconButton
        key={uuid()}
        icon="more_vertical"
        iconColor={iconColor}
        style={{ padding: 0, margin: 0, minWidth: 30 }}
        fontSizeIcon="small"
        handleClick={handleOpenContextMenu}
      />
      <Menu
        key={uuid()}
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        anchorReference="anchorPosition"
        anchorPosition={
          position.mouseY !== null && position.mouseX !== null
            ? { top: position.mouseY, left: position.mouseX }
            : undefined
        }
        onClose={handleCloseContextMenu}
      >
        {!blackList.includes(HoneycombContextOptions.ADD_PARTICIPANT) && (
          <MenuItem
            key={HoneycombContextOptions.ADD_PARTICIPANT}
            data-testid={HoneycombContextOptions.ADD_PARTICIPANT}
            onClick={handleOpenParticipantModal}
          >
            <ContextMenuItem
              icon="user"
              iconColor={theme.palette.variation6.main}
              title={t("contextMenuOptions.addParticipantContextTitle")}
            />
          </MenuItem>
        )}
        {!blackList.includes(HoneycombContextOptions.LEAVE_CONVERSATION) &&
          !isModerator(participantsIn, userRdx.user.id) && (
            <MenuItem
              key={HoneycombContextOptions.LEAVE_CONVERSATION}
              data-testid={HoneycombContextOptions.LEAVE_CONVERSATION}
              onClick={handleLeaveConversation}
            >
              <ContextMenuItem
                icon="close"
                iconColor={theme.palette.variation6.main}
                title={t("contextMenuOptions.leaveConversationContextTitle")}
                style={{ fontSize: 15 }}
              />
            </MenuItem>
            // eslint-disable-next-line indent
          )}
        {!blackList.includes(HoneycombContextOptions.REMOVE_CONVERSATION) &&
          !isModerator(participantsIn, userRdx.user.id) && (
            <MenuItem
              key={HoneycombContextOptions.REMOVE_CONVERSATION}
              data-testid={HoneycombContextOptions.REMOVE_CONVERSATION}
              onClick={unavailable}
            >
              <ContextMenuItem
                icon="trash"
                iconColor="tomato"
                title={t("contextMenuOptions.removeConversationContextTitle")}
              />
            </MenuItem>
            // eslint-disable-next-line indent
          )}
      </Menu>
      <Drawer anchor="right" open={openAddParticipant} onClose={() => setOpenAddParticipant(false)}>
        <Participants
          token={token}
          participantsIn={participantsIn}
          participantsOut={participantsOut}
          handleUpdateParticipants={() => setTokenUuid(uuid())}
        />
      </Drawer>
    </Box>
  );
};

export default ContextMenuOptions;
