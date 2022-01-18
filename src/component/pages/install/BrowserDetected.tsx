import React from "react";
import { useTranslation } from "next-i18next";
import Text from "@/components/ui/Text";
import { TextVariantEnum } from "@/enums/index";
import { useUserAgent } from "@oieduardorabelo/use-user-agent";

export default function BrowserDetected() {
  const { t } = useTranslation("install");
  const details = useUserAgent();

  if (!details) return null;

  const { browser } = details;

  return (
    <Text style={{ fontSize: 12, marginBottom: 30 }} variant={TextVariantEnum.SUBTITLE2}>
      {t("browserDetected", { browser: browser.name, version: browser.version })}
    </Text>
  );
}
