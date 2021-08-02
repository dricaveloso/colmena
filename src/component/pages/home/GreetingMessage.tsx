import React from "react";
import { useTranslation } from "next-i18next";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/index";
import { useSelector } from "react-redux";
import { PropsUserSelector } from "@/types/index";

function GreetingMessage() {
  const { t } = useTranslation("common");
  const userRdx = useSelector((state: { user: PropsUserSelector }) => state.user);
  return (
    <Text
      data-testid="greetingMessage"
      variant={TextVariantEnum.SUBTITLE2}
      style={{ marginTop: 10, fontWeight: "normal" }}
    >
      {t("welcomeRadioMessage", { mediaName: userRdx.user?.media.name })}
    </Text>
  );
}

export default GreetingMessage;
