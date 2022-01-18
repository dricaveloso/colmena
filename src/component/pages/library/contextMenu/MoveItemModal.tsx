import React, { useState, useCallback } from "react";
import LibraryModal from "@/components/ui/LibraryModal";
import Button from "@/components/ui/Button";
import { LibraryCardItemInterface, LibraryItemInterface } from "@/interfaces/index";
import { ButtonSizeEnum, EnvironmentEnum } from "@/enums/*";
import { pathIsInFilename, convertPrivateToUsername, getPath } from "@/utils/directory";
import { moveFile, getUniqueName } from "@/services/webdav/files";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { removeFirstSlash } from "@/utils/utils";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { toast } from "@/utils/notifications";
import { updateFile } from "@/store/idb/models/files";

type Props = {
  open: boolean;
  handleOpen: (opt: boolean) => void;
  cardItem: LibraryCardItemInterface;
};
export default function MoveItemModal({ handleOpen, open, cardItem }: Props) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [isDisabled, setIsDisabled] = useState(false);
  const [itemIsLoading, setItemIsLoading] = useState({} as LibraryItemInterface);
  const { t } = useTranslation("library");
  const router = useRouter();
  const options = (item: LibraryItemInterface) => {
    if (
      (cardItem.type !== "directory" ||
        (cardItem.type === "directory" && !pathIsInFilename(cardItem.filename, item.filename))) &&
      item.type === "directory"
    ) {
      return (
        <Button
          handleClick={() => handleClick(item)}
          disabled={isDisabled}
          isLoading={itemIsLoading.id === item.id}
          title={t("chooseButton")}
          size={ButtonSizeEnum.SMALL}
        />
      );
    }

    return null;
  };

  const footerActions = (item: LibraryItemInterface) => (
    <Button
      handleClick={() => handleClick(item)}
      disabled={isDisabled}
      isLoading={itemIsLoading.id === item.id}
      title={t("chooseButton")}
      size={ButtonSizeEnum.SMALL}
    />
  );

  const closeModal = () => {
    handleOpen(false);
  };

  const handleClick = (item: LibraryItemInterface) => {
    setItemIsLoading(item);
    setIsDisabled(true);
    (async () => {
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
            const timer = 5000;

            if (cardItem.type === "directory") {
              toast(t("messages.directorySuccessfullyMoved"), "success", { timer });
            } else {
              toast(t("messages.fileSuccessfullyMoved"), "success", { timer });
            }

            router.push(`/library/${removeFirstSlash(item.aliasFilename)}`);
          }
        }
      } catch (e) {
        toast(e.message, "error");

        setItemIsLoading({} as LibraryItemInterface);
        setIsDisabled(false);
      }
    })();
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

  return (
    <LibraryModal
      title={t("moveModalTitle")}
      handleClose={closeModal}
      open={open}
      options={options}
      isDisabled={isDisabled}
      footerActions={footerActions}
    />
  );
}
