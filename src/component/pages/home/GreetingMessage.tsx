import React from "react";
import { useTranslation } from "next-i18next";

type Props = {
  fontSize?: number;
};

function GreetingMessage({ fontSize = 20 }: Props) {
  const { t } = useTranslation("common");
  return (
    <>
      <p style={{ fontSize, marginBottom: 2 }}>
        <strong>{t("welcomeUserMessage", { userName: "Makena" })}</strong>
      </p>
      <span>{t("welcomeRadioMessage", { mediaName: "XYZ" })}</span>
    </>
  );
}

export default GreetingMessage;
