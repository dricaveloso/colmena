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
import { PermissionTalkMemberEnum, HoneycombContextOptions } from "@/enums/*";
import { PropsUserSelector } from "@/types/index";
import { useSelector } from "react-redux";
import { getRoomParticipants, removeYourselfFromAConversation } from "@/services/talk/room";
import Backdrop from "@/components/ui/Backdrop";
import theme from "@/styles/theme";
import ModalAddParticipant from "./ModalAddParticipant";
import { RoomParticipant } from "@/interfaces/talk";
import { listUsersByGroup } from "@/services/ocs/groups";
import { getUserGroup } from "@/utils/permissions";

type PositionProps = {
  mouseX: null | number;
  mouseY: null | number;
};

type Props = {
  token: string;
  handleFallbackParticipants?: (() => void) | null;
  handleFallbackLeaveConversation?: (() => void) | null;
  handleFallbackArchiveConversation?: (() => void) | null;
  iconColor?: string;
  blackList?: string[];
  archived?: boolean;
};

const ContextMenuOptions = ({
  token,
  handleFallbackParticipants = null,
  handleFallbackLeaveConversation = null,
  handleFallbackArchiveConversation = null,
  iconColor = "#fff",
  blackList = [],
  archived = false,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  const group = getUserGroup();

  const { data } = listUsersByGroup(group, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const { data: part } = getRoomParticipants(token, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  let usersFiltered: string[] = [];
  let participantsAddedHoneycomb: RoomParticipant[] = [];
  if (data && data.ocs && part && part.ocs) {
    participantsAddedHoneycomb = part.ocs.data;
    const participantsHoneycomb = part.ocs.data.map((item) => item.actorId);
    usersFiltered = data.ocs.data.users.filter(
      (item) => ![userRdx.user.id, "admin", ...participantsHoneycomb].includes(item),
    );
  }

  const { t } = useTranslation("honeycomb");
  const { t: c } = useTranslation("common");
  const [openAddParticipant, setOpenAddParticipant] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [position, setPosition] = useState<PositionProps>({
    mouseX: null,
    mouseY: null,
  });

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

  const handleCloseAddParticipant = () => {
    setOpenAddParticipant(false);
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

  async function handleArchiveConversation() {
    handleCloseContextMenu();
    if (handleFallbackArchiveConversation) handleFallbackArchiveConversation();
  }

  const isModerator = () => {
    const result = participantsAddedHoneycomb.find(
      (item) =>
        item.actorId === userRdx.user.id &&
        (item.participantType === PermissionTalkMemberEnum.OWNER ||
          item.participantType === PermissionTalkMemberEnum.MODERATOR),
    );
    return result;
  };

  const handleOpenParticipantModal = () => {
    if (!isModerator()) return;

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
              iconColor={
                !isModerator() ? theme.palette.variation6.light : theme.palette.variation6.main
              }
              title={t("contextMenuOptions.addParticipantContextTitle")}
            />
          </MenuItem>
        )}
        {!blackList.includes(HoneycombContextOptions.ARCHIVE_CONVERSATION) && (
          <MenuItem
            key={HoneycombContextOptions.ARCHIVE_CONVERSATION}
            data-testid={HoneycombContextOptions.ARCHIVE_CONVERSATION}
            onClick={handleArchiveConversation}
          >
            <ContextMenuItem
              icon="archive"
              iconColor={theme.palette.variation6.main}
              title={t(
                !archived
                  ? "contextMenuOptions.archiveConversationContextTitle"
                  : "contextMenuOptions.dearchiveConversationContextTitle",
              )}
            />
          </MenuItem>
        )}
        {!blackList.includes(HoneycombContextOptions.LEAVE_CONVERSATION) && !isModerator() && (
          <MenuItem
            key={HoneycombContextOptions.LEAVE_CONVERSATION}
            data-testid={HoneycombContextOptions.LEAVE_CONVERSATION}
            onClick={handleLeaveConversation}
          >
            <ContextMenuItem
              icon="close"
              iconColor={theme.palette.variation6.main}
              title={t("contextMenuOptions.leaveConversationContextTitle")}
            />
          </MenuItem>
        )}
        {!blackList.includes(HoneycombContextOptions.REMOVE_CONVERSATION) && isModerator() && (
          <MenuItem
            key={HoneycombContextOptions.REMOVE_CONVERSATION}
            data-testid={HoneycombContextOptions.REMOVE_CONVERSATION}
            onClick={unavailable}
          >
            <ContextMenuItem
              icon="trash"
              danger
              title={t("contextMenuOptions.removeConversationContextTitle")}
            />
          </MenuItem>
        )}
      </Menu>
      <ModalAddParticipant
        users={usersFiltered}
        token={token}
        isOpen={openAddParticipant}
        closeModal={handleCloseAddParticipant}
        setShowBackdrop={setShowBackdrop}
        handleFallbackParticipants={handleFallbackParticipants}
      />
    </Box>
  );
};

export default ContextMenuOptions;
