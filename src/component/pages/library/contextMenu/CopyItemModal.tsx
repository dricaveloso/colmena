import React, { useState, useCallback } from "react";
import LibraryModal from "@/components/ui/LibraryModal";
import Button from "@/components/ui/Button";
import { LibraryCardItemInterface, LibraryItemInterface } from "@/interfaces/index";
import { ButtonSizeEnum, EnvironmentEnum } from "@/enums/*";
import { convertPrivateToUsername, pathIsInFilename } from "@/utils/directory";
import { copyFile, getUniqueName } from "@/services/webdav/files";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/*";
import { removeFirstSlash } from "@/utils/utils";
import { useRouter } from "next/router";
import { toast } from "@/utils/notifications";
import { useTranslation } from "react-i18next";
import { createFile, getFile } from "@/store/idb/models/files";

type Props = {
  open: boolean;
  handleOpen: (opt: boolean) => void;
  cardItem: LibraryCardItemInterface;
};
export default function CopyItemModal({ handleOpen, open, cardItem }: Props) {
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
          title={t("pasteButton")}
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
      title={t("pasteButton")}
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
          let copy = false;
          switch (cardItem.environment) {
            case EnvironmentEnum.REMOTE:
              copy = await copyRemoteFile(destination);
              break;
            case EnvironmentEnum.LOCAL:
              copy = await copyLocalFile(destination, item.filename);
              break;
            case EnvironmentEnum.BOTH:
              copy = await copyRemoteFile(destination);
              if (copy) {
                copy = await copyLocalFile(destination, item.filename);
              }
              break;

            default:
              break;
          }

          if (copy) {
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

  const copyRemoteFile = useCallback(
    async (destination) => copyFile(userRdx.user.id, cardItem.filename, destination),
    [cardItem.filename, userRdx.user.id],
  );

  const copyLocalFile = useCallback(
    async (filename, path) => {
      const file = await getFile(cardItem.id);
      return createFile({
        ...file,
        environment: EnvironmentEnum.LOCAL,
        createAt: new Date(),
        id: undefined,
        path,
        filename,
        aliasFilename: convertPrivateToUsername(filename, userRdx.user.id),
      });
    },
    [cardItem.id, userRdx.user.id],
  );

  const handleFileName = (name: string, path: string) => getUniqueName(userRdx.user.id, path, name);

  return (
    <LibraryModal
      title={t("copyModalTitle")}
      handleClose={closeModal}
      open={open}
      options={options}
      isDisabled={isDisabled}
      footerActions={footerActions}
    />
  );
}
