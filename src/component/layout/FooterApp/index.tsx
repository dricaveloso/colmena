import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import TermsOfUse from "@/components/statefull/TermsOfUse";
import { v4 as uuid } from "uuid";

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
          key={uuid()}
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
          key={uuid()}
          size="small"
          style={{ textTransform: "capitalize", color: "gray" }}
          onClick={() => setOpenTerms(true)}
        >
          {t("termsOfUse")}
        </Button>,
      );
    }
    actionsArray.push(
      <div key={uuid()}>
        <TermsOfUse open={openTerms} handleSetOpen={(flag: boolean) => setOpenTerms(flag)} />
      </div>,
    );
    return actionsArray;
  }

  return (
    <div
      style={
        fixed
          ? { position: "fixed", bottom: 0, marginBottom: 10 }
          : { display: "flex", flexDirection: "column" }
      }
    >
      {getActions()}
    </div>
  );
}

export default FooterApp;
