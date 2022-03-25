import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { LibraryItemContextMenuInterface, LibraryItemInterface } from "@/interfaces/index";
import { ContextMenuEventEnum, ContextMenuOptionEnum, EnvironmentEnum } from "@/enums/*";
import { remove } from "@/store/idb/models/files";
import { deleteDirectory } from "@/services/webdav/directories";
import { deleteFile } from "@/services/webdav/files";
import ActionConfirm from "@/components/ui/ActionConfirm";
import { toast } from "@/utils/notifications";
import { isFileOwner } from "@/services/share/share";

type Props = {
  handleOpen: (opt: boolean) => void;
  cardItem: LibraryItemContextMenuInterface;
};

export default function DeleteItemConfirm({ handleOpen, cardItem }: Props) {
  const { t } = useTranslation("library");
  const { t: c } = useTranslation("common");
  const [isLoading, setIsLoading] = useState(false);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const checkRemotePermission = [EnvironmentEnum.REMOTE, EnvironmentEnum.BOTH];
      if (checkRemotePermission.includes(cardItem.environment)) {
        const canDelete = await isFileOwner(cardItem.filename);
        if (!canDelete) {
          throw new Error(t("messages.noRemovePermission"));
        }
      }

      const { id } = cardItem;
      let deleted = false;
      switch (cardItem.environment) {
        case EnvironmentEnum.REMOTE:
          deleted = await deleteRemoteItem();
          break;
        case EnvironmentEnum.LOCAL:
          deleted = await remove(id, userRdx.user.id);
          break;
        case EnvironmentEnum.BOTH:
          deleted = await deleteRemoteItem();
          if (deleted) {
            deleted = await remove(id, userRdx.user.id);
          }
          break;
        default:
          throw new Error(t("messages.unidentifiedEnvironment"));
      }

      if (!deleted) {
        throw new Error(t("messages.couldNotRemove"));
      }

      if (cardItem.type === "directory") {
        toast(t("messages.directorySuccessfullyRemoved"), "success");
      } else {
        toast(t("messages.fileSuccessfullyRemoved"), "success");
      }

      const item = cardItem as LibraryItemInterface;
      await cardItem.onChange(item, ContextMenuEventEnum.DELETE, ContextMenuOptionEnum.DELETE);
      handleClose();
    } catch (e) {
      setIsLoading(false);
      toast(e.message, "error");
      handleClose();
    }
  };

  const handleClose = () => {
    handleOpen(false);
  };

  const deleteRemoteItem = async () => {
    if (cardItem.type === "directory") {
      return deleteDirectory(userRdx.user.id, cardItem.filename);
    }

    return deleteFile(userRdx.user.id, cardItem.filename);
  };

  return (
    <>
      <ActionConfirm
        data-testid="delete-item-confirm"
        onOk={handleDelete}
        onClose={handleClose}
        isLoading={isLoading}
        showMessage={false}
        title={c("confirmationDeleteFile")}
      />
    </>
  );
}
