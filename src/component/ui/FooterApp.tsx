import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import TermsOfUse from "component/statefull/TermsOfUse";

function FooterApp() {
  const [openTerms, setOpenTerms] = useState(false);
  const { t } = useTranslation("drawer");
  return (
    <>
      <div className="footer">
        2021 CCC - MAIA - <a onClick={() => setOpenTerms(true)}>{t("termsOfUse").toLowerCase()}</a>{" "}
        - <Link href="/about">{t("aboutMaia").toLowerCase()}</Link> -{" "}
        <Link href="/talk-to-us">{t("supportTitle").toLowerCase()}</Link>
      </div>
      <TermsOfUse open={openTerms} handleSetOpen={(flag) => setOpenTerms(flag)} />
    </>
  );
}

export default FooterApp;
