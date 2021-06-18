import React from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";

function FooterApp() {
  const { t } = useTranslation("drawer");
  return (
    <div className="footer">
      2020 CC - Maia -{" "}
      <Link href="/terms">{t("termsOfUse").toLowerCase()}</Link> -{" "}
      <Link href="/about">{t("aboutMaia").toLowerCase()}</Link> -{" "}
      <Link href="/talk-to-us">{t("supportTitle").toLowerCase()}</Link>
    </div>
  );
}

export default FooterApp;
