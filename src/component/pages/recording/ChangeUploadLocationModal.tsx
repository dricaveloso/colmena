import React from "react";
import LibraryModal from "@/components/ui/LibraryModal";
import Button from "@/components/ui/Button";
import { LibraryItemInterface } from "@/interfaces/index";
import { ButtonSizeEnum } from "@/enums/*";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  handleClose: () => void;
  handleClick: (path: string) => void;
  title: string;
};
export default function ChangeUploadLocationModal({
  handleClose,
  open,
  title,
  handleClick,
}: Props) {
  const { t } = useTranslation("library");

  const footerActions = (item: LibraryItemInterface) => (
    <Button
      handleClick={() => handleClick(item.aliasFilename)}
      title={t("chooseButton")}
      size={ButtonSizeEnum.SMALL}
    />
  );

  return (
    <LibraryModal
      title={title}
      handleClose={handleClose}
      open={open}
      footerActions={footerActions}
    />
  );
}
