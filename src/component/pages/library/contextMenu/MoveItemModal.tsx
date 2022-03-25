import React, { useState, useCallback, useEffect } from "react";
import LibraryModal from "@/components/ui/LibraryModal";
import Button from "@/components/ui/Button";
import { LibraryItemContextMenuInterface, LibraryItemInterface } from "@/interfaces/index";
import {
  ButtonSizeEnum,
  ContextMenuEventEnum,
  ContextMenuOptionEnum,
  EnvironmentEnum,
} from "@/enums/*";
import { pathIsInFilename, convertPrivateToUsername, getPath, isPanal } from "@/utils/directory";
import { moveFile, getUniqueName } from "@/services/webdav/files";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { useTranslation } from "react-i18next";
import { toast } from "@/utils/notifications";
import { updateFile } from "@/store/idb/models/files";
import { isFileOwner, shareInChat } from "@/services/share/share";
import SimpleBackdrop from "@/components/ui/Backdrop";

type Props = {
  open: boolean;
  handleOpen: (opt: boolean) => void;
  cardItem: LibraryItemContextMenuInterface;
};
export default function MoveItemModal({ handleOpen, open, cardItem }: Props) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [isDisabled, setIsDisabled] = useState(false);
  const [moveIsAllowed, setMoveIsAllowed] = useState(false);
  const [itemIsLoading, setItemIsLoading] = useState({} as LibraryItemInterface);
  const { t } = useTranslation("library");
  const options = (item: LibraryItemInterface) => {
    if (
      (cardItem.type !== "directory" ||
        (cardItem.type === "directory" && !pathIsInFilename(cardItem.filename, item.filename))) &&
      item.type === "directory"
    ) {
      // return (
      //   <Button
      //     handleClick={() => handleClick(item)}
      //     disabled={isDisabled}
      //     isLoading={itemIsLoading.id === item.id}
      //     title={t("moveButton")}
      //     size={ButtonSizeEnum.SMALL}
      //   />
      // );
    }

    return null;
  };

  const footerActions = (item: LibraryItemInterface) => (
    <Button
      handleClick={() => handleClick(item)}
      disabled={isDisabled}
      isLoading={itemIsLoading.id === item.id}
      title={t("moveButton")}
      size={ButtonSizeEnum.SMALL}
    />
  );

  const closeModal = () => {
    handleOpen(false);
  };

  const handleClick = async (item: LibraryItemInterface) => {
    setItemIsLoading(item);
    setIsDisabled(true);
    try {
      if (cardItem.filename && cardItem.basename) {
        const uniqueName = await handleFileName(cardItem.basename, item.filename);
        const destination = `${item.filename}/${uniqueName}`;
        let moved = false;

        switch (cardItem.environment) {
          case EnvironmentEnum.REMOTE:
            moved = await moveRemoteItem(destination);
            break;
          case EnvironmentEnum.LOCAL:
            moved = await moveLocalFile(destination);
            break;
          case EnvironmentEnum.BOTH:
            moved = await moveRemoteItem(destination);
            if (moved) {
              moved = await moveLocalFile(destination);
            }
            break;
          default:
            break;
        }

        if (moved) {
          if (
            isPanal(item.filename) &&
            (cardItem.environment === EnvironmentEnum.REMOTE ||
              cardItem.environment === EnvironmentEnum.BOTH)
          ) {
            await shareInChat(item.filename, cardItem.filename);
          }

          const timer = 5000;

          if (cardItem.type === "directory") {
            toast(t("messages.directorySuccessfullyMoved"), "success", { timer });
          } else {
            toast(t("messages.fileSuccessfullyMoved"), "success", { timer });
          }

          const updatedItem = {
            ...cardItem,
            filename: destination,
            aliasFilename: convertPrivateToUsername(destination, userRdx.user.id),
            basename: uniqueName,
          } as LibraryItemInterface;
          await cardItem.onChange(
            updatedItem,
            ContextMenuEventEnum.CREATE,
            ContextMenuOptionEnum.MOVE,
            { oldItem: cardItem },
          );
          closeModal();
        }
      }
    } catch (e) {
      toast(e.message, "error");

      setItemIsLoading({} as LibraryItemInterface);
      setIsDisabled(false);
    }
  };

  const moveRemoteItem = useCallback(
    (destination) => moveFile(userRdx.user.id, cardItem.filename, destination),
    [cardItem.filename, userRdx.user.id],
  );

  const moveLocalFile = useCallback(
    async (destination) =>
      updateFile(cardItem.id, {
        path: getPath(destination),
        filename: destination,
        aliasFilename: convertPrivateToUsername(destination, userRdx.user.id),
      }),
    [cardItem.id, userRdx.user.id],
  );

  const handleFileName = (name: string, path: string) => getUniqueName(userRdx.user.id, path, name);

  const checkPermission = async () => {
    const checkRemotePermission = [EnvironmentEnum.REMOTE, EnvironmentEnum.BOTH];
    if (checkRemotePermission.includes(cardItem.environment)) {
      const canMove = await isFileOwner(cardItem.filename);
      if (!canMove) {
        toast(t("messages.noMovePermission"), "error");
        closeModal();

        return;
      }
    }

    setMoveIsAllowed(true);
  };

  useEffect(() => {
    checkPermission();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SimpleBackdrop open={!moveIsAllowed} />
      {moveIsAllowed && (
        <LibraryModal
          title={t("moveModalTitle")}
          handleClose={closeModal}
          open={open}
          options={options}
          isDisabled={isDisabled}
          footerActions={footerActions}
        />
      )}
    </>
  );
}
