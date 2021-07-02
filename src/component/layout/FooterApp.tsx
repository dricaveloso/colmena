import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import TermsOfUse from "component/statefull/TermsOfUse";

type Props = {
  about?: boolean;
  terms?: boolean;
  fixed?: boolean;
};

function FooterApp({ about = false, terms = true, fixed = false }: Props) {
  const [openTerms, setOpenTerms] = useState(false);
  const { t } = useTranslation("common");
  const router = useRouter();

  function getActions() {
    const actionsArray = [];
    if (about) {
      actionsArray.push(
        <Button
          size="small"
          variant="text"
          style={{ textTransform: "capitalize", color: "gray" }}
          onClick={() => router.push("/about")}
        >
          {t("aboutMaia")}
        </Button>,
      );
    }
    if (terms) {
      actionsArray.push(
        <Button
          size="small"
          style={{ textTransform: "capitalize", color: "gray" }}
          onClick={() => setOpenTerms(true)}
        >
          {t("termsOfUse")}
        </Button>,
      );
    }
    actionsArray.push(
      <TermsOfUse open={openTerms} handleSetOpen={(flag: boolean) => setOpenTerms(flag)} />,
    );
    return actionsArray;
  }

  if (fixed) {
    return <Box style={{ position: "fixed", bottom: 0, marginBottom: 10 }}>{getActions()}</Box>;
  }

  return <Box style={{ display: "flex", flexDirection: "column" }}>{getActions()}</Box>;
}

export default FooterApp;
