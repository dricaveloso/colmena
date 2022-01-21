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
import Modal from "@/components/ui/Modal";
import UsersList from "@/components/ui/FooterApp/ModalTools/NewHoneycombModal/UsersList";
import { listUsersByGroup } from "@/services/ocs/groups";
import { getUserGroup } from "@/utils/permissions";
import Button from "@/components/ui/Button";
import { ButtonColorEnum, ButtonVariantEnum, PermissionTalkMemberEnum } from "@/enums/*";
import { PropsUserSelector } from "@/types/index";
import { useSelector } from "react-redux";
import { addParticipantToConversation, getRoomParticipants } from "@/services/talk/room";
import Backdrop from "@/components/ui/Backdrop";
import { RoomParticipant } from "@/interfaces/talk";

type PositionProps = {
  mouseX: null | number;
  mouseY: null | number;
};

type Props = {
  token: string;
  reloadChatList: () => void;
};

const ContextMenuOptions = ({ token, reloadChatList }: Props) => {
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
  const [participants, setParticipants] = useState<string[]>([]);
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

  async function handleInviteParticipants() {
    try {
      handleCloseAddParticipant();
      setShowBackdrop(true);
      // eslint-disable-next-line no-restricted-syntax
      for (const participant of participants) {
        // eslint-disable-next-line no-await-in-loop
        await addParticipantToConversation(token, participant);
      }
      toast(t("contextMenuOptions.participantsAddedSuccessfully"), "success");
      reloadChatList();
    } catch (e) {
      console.log(e);
      toast(c("genericErrorMessage"), "error");
    } finally {
      setShowBackdrop(false);
    }
  }

  const handleOpenParticipantModal = () => {
    if (!part) return;

    const isModerator = participantsAddedHoneycomb.find(
      (item) =>
        item.actorId === userRdx.user.id &&
        (item.participantType === PermissionTalkMemberEnum.OWNER ||
          item.participantType === PermissionTalkMemberEnum.MODERATOR),
    );
    if (!isModerator) {
      toast(c("noPrivilegesAccessTitle"), "error");
      return;
    }

    handleCloseContextMenu();
    setOpenAddParticipant(true);
  };

  return (
    <Box display="flex" justifyContent="flex-end">
      <Backdrop open={showBackdrop} />
      <IconButton
        key={uuid()}
        icon="more_vertical"
        iconColor="#fff"
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
        <MenuItem key="add" onClick={handleOpenParticipantModal}>
          <ContextMenuItem icon="user" title={t("contextMenuOptions.addParticipantContextTitle")} />
        </MenuItem>
      </Menu>
      <Modal
        title={t("contextMenuOptions.addParticipantContextTitle")}
        handleClose={handleCloseAddParticipant}
        open={openAddParticipant}
        actions={
          <Box display="flex" flex="1" flexDirection="row" justifyContent="space-between">
            <Button
              handleClick={handleCloseAddParticipant}
              style={{ margin: 8 }}
              variant={ButtonVariantEnum.OUTLINED}
              color={ButtonColorEnum.SECONDARY}
              title={c("form.cancelButton")}
            />
            <Button
              handleClick={handleInviteParticipants}
              disabled={participants.length === 0}
              style={{ margin: 8 }}
              variant={ButtonVariantEnum.CONTAINED}
              color={ButtonColorEnum.PRIMARY}
              title={c("form.submitSaveTitle")}
            />
          </Box>
        }
      >
        <UsersList
          participants={participants}
          updateParticipants={(part) => setParticipants(part)}
          users={usersFiltered}
        />
      </Modal>
    </Box>
  );
};

export default ContextMenuOptions;
