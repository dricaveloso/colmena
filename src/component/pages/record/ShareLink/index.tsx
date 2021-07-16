import React from "react";
import IconButton from "@/components/ui/IconButton";
import { useTranslation } from "next-i18next";
import { TextVariantEnum } from "@/enums/index";
import SimpleDialog from "./SimpleDialog";

type ShareLinkProps = {
  url: string;
};

export default function ShareLink({ url }: ShareLinkProps) {
  const { t } = useTranslation("call");

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
          icon="add_user"
          fontSizeIcon="large"
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
