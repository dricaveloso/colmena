import React, { useContext } from "react";
import { useTranslation } from "next-i18next";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/index";
import UserContext from "@/store/user-context";

function GreetingMessage() {
  const { t } = useTranslation("common");
  const userCtx = useContext(UserContext);
  return (
    <Text
      data-testid="greetingMessage"
      variant={TextVariantEnum.SUBTITLE2}
      style={{ marginTop: 10, fontWeight: "normal" }}
    >
      {t("welcomeRadioMessage", { mediaName: userCtx.userInfo?.media.name })}
    </Text>
  );
}

export default GreetingMessage;
