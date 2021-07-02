import React from "react";
import IconButton from "component/ui/IconButton";
import { useTranslation } from "next-i18next";
import { TextVariantEnum } from "enums";
import SimpleDialog from "./SimpleDialog";

type ShareLinkProps = {
  url: string;
};

export default function ShareLink({ url }: ShareLinkProps) {
  const { t } = useTranslation("record");

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div>
        <IconButton
          title={t("textInvite")}
          variantTitle={TextVariantEnum.SUBTITLE1}
          icon="person_add"
          fontSizeIcon="1.8em"
          color="black"
          handleClick={handleClickOpen}
        />
      </div>
      <SimpleDialog
        open={open}
        onClose={handleClose}
        titleShareLink={t("titleShareLink")}
        url={url}
      />
    </>
  );
}
