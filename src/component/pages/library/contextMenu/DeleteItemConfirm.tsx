import React, { useContext, useState } from "react";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { LibraryCardItemInterface } from "@/interfaces/index";
import { EnvironmentEnum, NotificationStatusEnum } from "@/enums/*";
import { remove } from "@/store/idb/models/files";
import { removeLibraryFile } from "@/store/actions/library";
import NotificationContext from "@/store/context/notification-context";
import { deleteDirectory } from "@/services/webdav/directories";
import { deleteFile } from "@/services/webdav/files";
import ActionConfirm from "@/components/ui/ActionConfirm";

type Props = {
  handleOpen: (opt: boolean) => void;
  cardItem: LibraryCardItemInterface;
};

export default function DeleteItemConfirm({ handleOpen, cardItem }: Props) {
  const { t } = useTranslation("library");
  const [isLoading, setIsLoading] = useState(false);
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const notificationCtx = useContext(NotificationContext);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
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

      dispatch(removeLibraryFile(id));
      handleClose();
    } catch (e) {
      setIsLoading(false);
      notificationCtx.showNotification({
        message: e.message,
        status: NotificationStatusEnum.ERROR,
      });
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
      <ActionConfirm onOk={handleDelete} onClose={handleClose} isLoading={isLoading} />
    </>
  );
}
