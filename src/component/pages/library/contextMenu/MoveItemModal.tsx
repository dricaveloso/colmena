import React, { useContext, useState } from "react";
import LibraryModal from "@/components/ui/LibraryModal";
import Button from "@/components/ui/Button";
import { LibraryCardItemInterface, LibraryItemInterface } from "@/interfaces/index";
import { ButtonSizeEnum, NotificationStatusEnum } from "@/enums/*";
import { getPrivatePath, pathIsInFilename } from "@/utils/directory";
import { moveFile, getUniqueName } from "@/services/webdav/files";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { removeFirstSlash } from "@/utils/utils";
import { useRouter } from "next/router";
import NotificationContext from "@/store/context/notification-context";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  handleOpen: (opt: boolean) => void;
  cardItem: LibraryCardItemInterface;
};
export default function MoveItemModal({ handleOpen, open, cardItem }: Props) {
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  const [isDisabled, setIsDisabled] = useState(false);
  const [itemIsLoading, setItemIsLoading] = useState({} as LibraryItemInterface);
  const notificationCtx = useContext(NotificationContext);
  const { t } = useTranslation("library");
  const router = useRouter();
  const options = (item: LibraryItemInterface) => {
    if (
      (cardItem.type !== "directory" ||
        (cardItem.type === "directory" && !pathIsInFilename(cardItem.filename, item.filename))) &&
      item.type === "directory" &&
      pathIsInFilename(getPrivatePath(), item.filename)
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
          const moved = await moveFile(userRdx.user.id, cardItem.filename, destination);
          if (moved) {
            router.push(`/library/${removeFirstSlash(item.filename)}`);
          }
        }
      } catch (e) {
        notificationCtx.showNotification({
          message: e.message,
          status: NotificationStatusEnum.ERROR,
        });

        setItemIsLoading({} as LibraryItemInterface);
        setIsDisabled(false);
      }
    })();
  };

  const handleFileName = (name: string, path: string) => getUniqueName(userRdx.user.id, path, name);

  return (
    <LibraryModal
      title={t("moveModalTitle")}
      handleClose={closeModal}
      open={open}
      options={options}
      isDisabled={isDisabled}
    />
  );
}
