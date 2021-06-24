import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import TermsOfUse from "component/statefull/TermsOfUse";

function FooterApp({ about = false, terms = true, fixed = false }) {
  const [openTerms, setOpenTerms] = useState(false);
  const { t } = useTranslation("common");

  const customStyle = fixed
    ? { position: "fixed", bottom: 0, marginBottom: 10 }
    : { display: "flex", flexDirection: "column" };

  const router = useRouter();

  return (
    <Box style={customStyle}>
      {about && (
        <Button
          size="small"
          variant="text"
          style={{ textTransform: "capitalize", color: "gray" }}
          onClick={() => router.push("/about")}
        >
          {t("aboutMaia")}
        </Button>
      )}
      {terms && (
        <Button
          size="small"
          style={{ textTransform: "capitalize", color: "gray" }}
          onClick={() => setOpenTerms(true)}
        >
          {t("termsOfUse")}
        </Button>
      )}
      <TermsOfUse
        open={openTerms}
        handleSetOpen={(flag) => setOpenTerms(flag)}
      />
    </Box>
  );
}

export default FooterApp;
