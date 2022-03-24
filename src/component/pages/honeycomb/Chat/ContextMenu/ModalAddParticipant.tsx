import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import UsersList from "@/components/ui/FooterApp/ModalTools/NewHoneycombModal/UsersList";
import Button from "@/components/ui/Button";
import Box from "@material-ui/core/Box";
import { addParticipantToConversation } from "@/services/talk/room";
import { ButtonColorEnum, ButtonVariantEnum } from "@/enums/*";
import { toast } from "@/utils/notifications";
import { useTranslation } from "next-i18next";

type Props = {
  users: string[];
  token: string;
  isOpen: boolean;
  closeModal: () => void;
  setShowBackdrop: (opt: boolean) => void;
  handleFallbackParticipants?: (() => void) | null;
};

export default function ModalAddParticipant({
  users,
  token,
  isOpen,
  closeModal,
  setShowBackdrop,
  handleFallbackParticipants,
}: Props) {
  const [participants, setParticipants] = useState<string[]>([]);
  const { t } = useTranslation("honeycomb");
  const { t: c } = useTranslation("common");

  const handleInviteParticipants = async () => {
    try {
      closeModal();
      setShowBackdrop(true);
      // eslint-disable-next-line no-restricted-syntax
      for (const participant of participants) {
        // eslint-disable-next-line no-await-in-loop
        await addParticipantToConversation(token, participant);
      }

      toast(t("contextMenuOptions.participantsAddedSuccessfully"), "success");
      if (handleFallbackParticipants) handleFallbackParticipants();
    } catch (e) {
      console.log(e);
      toast(c("genericErrorMessage"), "error");
    } finally {
      setShowBackdrop(false);
    }
  };

  const ButtonStep1Style = {
    color: "#fff",
    margin: 8,
  };

  return (
    <Modal
      title={t("contextMenuOptions.addParticipantContextTitle")}
      handleClose={closeModal}
      open={isOpen}
      actions={
        <Box display="flex" flex="1" flexDirection="row" justifyContent="space-between">
          <Button
            handleClick={closeModal}
            style={{ margin: 8 }}
            variant={ButtonVariantEnum.OUTLINED}
            color={ButtonColorEnum.SECONDARY}
            title={c("form.cancelButton")}
          />
          <Button
            handleClick={handleInviteParticipants}
            disabled={participants.length === 0}
            style={participants.length > 0 ? ButtonStep1Style : { margin: 8 }}
            variant={
              participants.length > 0 ? ButtonVariantEnum.CONTAINED : ButtonVariantEnum.OUTLINED
            }
            title={c("form.submitSaveTitle")}
          />
        </Box>
      }
    >
      <UsersList
        participants={participants}
        updateParticipants={(part) => setParticipants(part)}
        users={users}
      />
    </Modal>
  );
}
